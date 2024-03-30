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
const { type } = require('@testing-library/user-event/dist/type');
// when setting middleware, we use app.use()
app.use(bodyParser.json());

// set the public path of backend
// app.use(express.static(path.join(__dirname, 'public')));

// allow the cors error
const corsOpts = {
    origin: '*',
    credentials: true,
    methods: ['GET','POST','HEAD','PUT','PATCH','DELETE'],
    allowedHeaders: ['Content-Type'],
    exposedHeaders: ['Content-Type']
};
app.use(cors(corsOpts));



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
const shuffledNumbers = shuffleArray(numbers);
console.log(shuffledNumbers)



const MSG = {
  loadInputTokenSuccess: "✅ Loaded input tokens successfully!",
  loadTradeTokenSuccess: "✅ Loaded trade tokens successfully!",
  updateTradeTokenSuccess: "✅ Updated trade tokens successfully!",
  buySuccess: "🏆 Bought Successfully!",
  sellSucess: "💲 Sold Successfully. Congratulation!👏👏👏",
  detectedRugpull: "🤣 Detected rug pull!",
  currentMarketStatus: "😎 Current Market Status: \n",
  swapError: "❗ Issued some problems while swapping! \nRetry...",
  confirmTransactionFailed: "🚩 Transaction is not confirmed!",
  startTrade: "😎 Start trade!",
  updateOutputSuccess: "🤣🤣🤣🤣 Save profit successfully!",
  startToBuy: "Start to buy!",
  waiting: "waiting...",
};

const sleep = async (ms) => {
  console.log(`Retry after ${ms / 1000} seconds...`);
  console.log(MSG.waiting);
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const swap = async (input, output, inputAmount, index) => {
  const wallet = Keypair.fromSecretKey(bs58.decode(WALLET_SECRET_KEY[index].secret_key));
  const SLIPPAGE = 5;
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
      // updateLog(MSG.confirmTransactionFailed);
      // await sleep(300000);
      // console.log("error: ", error.message);
      return false;
    }
  } catch (err) {
    console.log("err", err)
  }
}

const executeTransaction = async (input, tokenaddress, inputAmount, index) => {
  console.log(index, shuffledNumbers, shuffledNumbers[index])
  await swap(input, tokenaddress, inputAmount, shuffledNumbers[index])
  // index exception
  if(index < 4) {
    setTimeout(executeTransaction, 3000, input, tokenaddress, inputAmount, index+1)
  } else {
    return 'end'
  }
}
app.get('/', async (req, res) => {
    const input = "So11111111111111111111111111111111111111112";
    const inputAmount = Math.pow(10, 9) * 0.00001
    const {tokenaddress} = req.query;
    console.log("shuffledNumbers", shuffledNumbers)
    executeTransaction(input, tokenaddress, inputAmount, 0)
  // shuffledNumbers.map(async (value, index) => {
  //   console.log(index, value)
  //   await swap(input, tokenaddress, inputAmount, value)
  //   await sleep(300000)
  // })
  res.status(200).json({"tokenaddress":tokenaddress})

})

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

module.exports = app;