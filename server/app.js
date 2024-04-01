const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const WALLET_SECRET_KEY = require('./config/walllet.json');
const axios = require('axios');
const {
    Connection,
    Keypair,
    VersionedTransaction,
  } = require("@solana/web3.js");
const bs58 = require("bs58");
// when setting middleware, we use app.use()
app.use(bodyParser.json());
// allow the cors error
const corsOpts = {
    origin: '*',
    credentials: true,
    methods: ['GET','POST','HEAD','PUT','PATCH','DELETE'],
    allowedHeaders: ['Content-Type'],
    exposedHeaders: ['Content-Type']
};
app.use(cors(corsOpts));

var timeoutId = null;
var executeTransactionFlag = true;

const connection = new Connection(
    "https://spring-capable-tent.solana-mainnet.quiknode.pro/6a3fa9f48cd11ebaa96901b009e38a33aa1968b1/",
    "confirmed"
);

// Function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Generate an array containing numbers from 1 to 30
const numbers = Array.from({ length: 5 }, (_, index) => index);

// Shuffle the array
let shuffledNumbers = shuffleArray(numbers);
console.log(shuffledNumbers)

const MSG = {
  confirmTransactionFailed: "🚩 Transaction is not confirmed!",
  waiting: "waiting...",
};

const swap = async (input, output, inputAmount, index) => {
  const wallet = Keypair.fromSecretKey(bs58.decode(WALLET_SECRET_KEY[index].secret_key));
  const SLIPPAGE = 100;
  let quoteResponse = null;
  console.log(input, output, inputAmount, index)
  try {
    quoteResponse = await axios.get(
        `https://quote-api.jup.ag/v6/quote?inputMint=${input}&outputMint=${output}&amount=${inputAmount}&slippageBps=${SLIPPAGE}`
        );
    
  } catch (error) {
      console.error("quote-error", error)      
  }

  const quoteResponseData = quoteResponse.data
  console.log("quoteResponseData", quoteResponseData)
  let swapTransaction = null
  await axios.post(
    'https://quote-api.jup.ag/v6/swap',
    {
      quoteResponse: quoteResponseData,
      userPublicKey: wallet.publicKey.toString(),
      wrapAndUnwrapSol: true,
    }).then((resp) => {
      swapTransaction = resp.data
    }).catch(err => {
      console.error("swap-error", err)
    });
  console.log("swapTransaction", swapTransaction)
  
  try {
    // deserialize the transaction
    const swapTransactionBuf = Buffer.from(swapTransaction.swapTransaction, "base64");
    console.log("swapTransactionBuf---------", swapTransactionBuf)
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf); //    sign the transaction
    transaction.sign([wallet]);
    const rawTransaction = transaction.serialize();
    const txid = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      maxRetries: 5,
    });
    console.log("txid: ", txid);
    console.log("Swapping....");
    const latestBlockHash = await connection.getLatestBlockhash();
    console.log("latestBlockHash", latestBlockHash)
    try {
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid,
      });
      console.log(`https://solscan.io/tx/${txid}`);
      return {
        outAmount: Number(quoteResponseData.outAmount),
      };
    } catch (error) {
        console.log(MSG.confirmTransactionFailed);
        return false;
    }
  } catch (err) {
    console.log("err", err)
  }
}

const executeTransaction = async (input, tokenaddress, inputAmount, index, timestamp, req) => {

  if(index < 5) {
    // Generate a random number between MaxSOL and MinSOL
    const randomNumber = (Math.random() * (Number(inputAmount.max) - Number(inputAmount.min)) + Number(inputAmount.max)).toFixed(6);
    const InAmount = Math.pow(10, 9) * randomNumber
    console.log(`wallet${shuffledNumbers[index]}'s inputamount`, InAmount)
    await swap(input, tokenaddress, InAmount, shuffledNumbers[index])
    console.log("timeoutId after swapping", timeoutId)
    if (executeTransactionFlag) {
      timeoutId = setTimeout(executeTransaction, timestamp * 1000, input, tokenaddress, inputAmount, index+1, timestamp, req)
    }

  } 
  else {
     index = 0;
     const numbers = Array.from({ length: 5 }, (_, index) => index);

     // Shuffle the array
     const _shuffledNumbers = shuffleArray(numbers);
     shuffledNumbers = _shuffledNumbers;
     console.log("index > 5---shuffledNumbers", shuffledNumbers)
     timeoutId = setTimeout(executeTransaction, 0, input, tokenaddress, inputAmount, index, timestamp, req)
     console.log('end')
   }
}
app.get('/', async (req, res) => {

  const input = "So11111111111111111111111111111111111111112";
  const {tokenaddress, maxSol, minSol, timestamp, stop} = req.query;
  console.log("global timeoutId", timeoutId)
  if(stop) {
    clearTimeout(timeoutId);
    timeoutId = null;
    executeTransactionFlag = false;
    res.send("stopped");
  } else {
    const inputAmount = {
      max: maxSol,
      min: minSol
    }
    executeTransaction(input, tokenaddress, inputAmount, 0, timestamp, req)
    res.send("run!")
  }

})

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

module.exports = app;