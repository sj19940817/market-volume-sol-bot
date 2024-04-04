const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const WALLET_SECRET_KEY = require("./config/walllet.json");
const axios = require("axios");
const {
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  VersionedTransaction,
} = require("@solana/web3.js");
const { TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const { Pnl } = require("./models");
const bs58 = require("bs58");
// when setting middleware, we use app.use()
app.use(bodyParser.json());
// allow the cors error
const corsOpts = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["Content-Type"],
};
app.use(cors(corsOpts));

var timeoutId = null;
var executeBuy = true;
var executeSell = true;

const connection = new Connection(
  "https://spring-capable-tent.solana-mainnet.quiknode.pro/6a3fa9f48cd11ebaa96901b009e38a33aa1968b1/",
  "confirmed"
);

const getTokenAccounts = async (wallet) => {
  let targetTokenAmount = null;
  const filters = [
    {
      dataSize: 165, //size of account (bytes)
    },
    {
      memcmp: {
        offset: 32, //location of our query in the account (bytes)
        bytes: wallet, //our search criteria, a base58 encoded string
      },
    },
  ];
  const accounts = await connection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID, //SPL Token Program, new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    { filters: filters }
  );
  console.log(
    `Found ${accounts.length} token account(s) for wallet ${wallet}.`
  );
  accounts.forEach((account, i) => {
    //Parse the account data
    const parsedAccountInfo = account.account.data;
    const mintAddress = parsedAccountInfo["parsed"]["info"]["mint"];
    if (mintAddress == "HLptm5e6rTgh4EKgDpYFrnRHbjpkMyVdEeREEa2G7rf9") {
      targetTokenAmount =
        parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
    }
  });
  return targetTokenAmount;
};
// Function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

console.log(typeof WALLET_SECRET_KEY.length);
// Generate an array containing numbers from 1 to 30
const numbers = Array.from(
  { length: WALLET_SECRET_KEY.length },
  (_, index) => index
);

// Shuffle the array
let shuffledNumbers = shuffleArray(numbers);
console.log(shuffledNumbers);

const MSG = {
  confirmTransactionFailed: "🚩 Transaction is not confirmed!",
  waiting: "waiting...",
};

const swap = async (input, output, inputAmount, index, option) => {
  const wallet = Keypair.fromSecretKey(
    bs58.decode(WALLET_SECRET_KEY[index].secret_key)
  );
  const SLIPPAGE = 100;
  let quoteResponse = null;
  console.log(input, output, inputAmount, index);

  try {
    quoteResponse = await axios.get(
      `https://quote-api.jup.ag/v6/quote?inputMint=${input}&outputMint=${output}&amount=${inputAmount}&slippageBps=${SLIPPAGE}`
    );
  } catch (error) {
    console.error("quote-error", error);
  }

  const quoteResponseData = quoteResponse.data;
  console.log("quoteResponseData", quoteResponseData);
  let swapTransaction = null;
  await axios
    .post("https://quote-api.jup.ag/v6/swap", {
      quoteResponse: quoteResponseData,
      userPublicKey: wallet.publicKey.toString(),
      wrapAndUnwrapSol: true,
    })
    .then((resp) => {
      swapTransaction = resp.data;
    })
    .catch((err) => {
      console.error("swap-error", err);
    });
  console.log("swapTransaction", swapTransaction);

  try {
    // deserialize the transaction
    const swapTransactionBuf = Buffer.from(
      swapTransaction.swapTransaction,
      "base64"
    );
    console.log("swapTransactionBuf---------", swapTransactionBuf);
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
    console.log("latestBlockHash", latestBlockHash);
    try {
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid,
      });
      console.log(`https://solscan.io/tx/${txid}`);

      await Pnl.create({
        wallet_address: wallet.publicKey.toString(),
        type: option,
        sol:
          option == "buy"
            ? -inputAmount / Math.pow(10, 9)
            : quoteResponseData.outAmount / Math.pow(10, 9),
      });
      return {
        outAmount: Number(quoteResponseData.outAmount),
      };
    } catch (error) {
      console.log(MSG.confirmTransactionFailed);
      return false;
    }
  } catch (err) {
    console.log("err", err);
  }
};

const executeTransaction = async (
  input,
  output,
  inputAmount,
  index,
  timestamp,
  Decimal,
  option
) => {
  if (index < WALLET_SECRET_KEY.length) {
    // Generate a random number between MaxVal and MinVal
    const randomNumber = (
      Math.random() * (Number(inputAmount.max) - Number(inputAmount.min)) +
      Number(inputAmount.min)
    ).toFixed(6);
    let InAmount = Math.pow(10, Decimal) * randomNumber;
    console.log(InAmount, randomNumber, inputAmount, Decimal);
    InAmount = Math.ceil(InAmount);
    console.log(`wallet${shuffledNumbers[index]}'s inputamount`, InAmount);
    await swap(input, output, InAmount, shuffledNumbers[index], option);
    console.log("timeoutId after swapping", timeoutId, executeBuy);
    if (executeBuy || executeSell) {
      timeoutId = setTimeout(
        executeTransaction,
        timestamp * 1000,
        input,
        output,
        inputAmount,
        index + 1,
        timestamp,
        Decimal,
        option
      );
    }
  } else {
    index = 0;
    const numbers = Array.from(
      { length: WALLET_SECRET_KEY.length },
      (_, index) => index
    );

    // Shuffle the array
    const _shuffledNumbers = shuffleArray(numbers);
    shuffledNumbers = _shuffledNumbers;
    console.log(
      `index > ${WALLET_SECRET_KEY.length}---shuffledNumbers`,
      shuffledNumbers
    );
    timeoutId = setTimeout(
      executeTransaction,
      0,
      input,
      output,
      inputAmount,
      index,
      timestamp,
      Decimal,
      option
    );
    console.log("end");
  }
};
app.get("/", async (req, res) => {
  const WrapSOL = "So11111111111111111111111111111111111111112";
  const { tokenaddress, maxVal, minVal, timestamp, stop, option } = req.query;

  console.log("option", option);
  console.log("maxVal=", maxVal, "minVal=", minVal);
  console.log("global timeoutId", timeoutId);
  if (stop) {
    clearTimeout(timeoutId);
    timeoutId = null;
    if (option == "buy") executeBuy = false;
    else if (option == "sell") executeSell = false;
    console.log(option + "is stopped");
    res.send(`${option} is stopped`);
  } else {
    if (option == "buy") executeBuy = true;
    else if (option == "sell") executeSell = true;
    let tokeninfo = await connection.getParsedAccountInfo(
      new PublicKey(tokenaddress)
    );

    // all the token data is here
    let Decimal =
      option == "buy" ? 9 : tokeninfo.value.data.parsed.info.decimals;
    console.log("Decimal=", Decimal);

    const inputAmount = {
      max: maxVal,
      min: minVal,
    };
    let input = option == "buy" ? WrapSOL : tokenaddress;
    let output = option == "buy" ? tokenaddress : WrapSOL;
    executeTransaction(
      input,
      output,
      inputAmount,
      0,
      timestamp,
      Decimal,
      option
    );
    res.send("run!");
  }
});

app.get("/load", async (req, res) => {
  let tableData = [];
  const getItem = async (private_key) => {
    const wallet = Keypair.fromSecretKey(bs58.decode(private_key.secret_key));
    const wallet_address = wallet.publicKey.toString();
    const balanceInLamports = await connection.getBalance(wallet.publicKey);
    const wallet_SOL = balanceInLamports / LAMPORTS_PER_SOL;
    const tokenAmount = await getTokenAccounts(wallet_address);
    const pnl = await Pnl.sum("sol", {
      where: {
        wallet_address: wallet_address,
      },
    });
    console.log("pnl", pnl);
    return {
      wallet_address: wallet_address,
      sol_amount: wallet_SOL,
      token_amount: tokenAmount,
      pnl: pnl,
    };
  };
  for (let i = 0; i < WALLET_SECRET_KEY.length; i++) {
    const item = await getItem(WALLET_SECRET_KEY[i]);
    console.log("item", item);
    tableData.push(item);
  }
  console.log("tableData", tableData);
  res.json(tableData);
});

app.get("/sells", async (req, res) => {
  const { wallet_address, token_amount, index } = req.query;
  console.log(
    "sells req============",
    "wallet_address",
    wallet_address,
    "token_amount",
    token_amount
  );
  const input = "HLptm5e6rTgh4EKgDpYFrnRHbjpkMyVdEeREEa2G7rf9";
  const output = "So11111111111111111111111111111111111111112";
  const InAmount = token_amount;
  const option = "sell";

  // await swap(input, output, InAmount, index, option);
  res.json({ wallet_address: wallet_address, token_amount: token_amount });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server started on port ${PORT}`));

module.exports = app;
