const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const bs58 = require("bs58");

// import wallet private key
const WALLET_SECRET_KEY = require("./config/walllet.json");

//axios
const axios = require("axios");

// web3 connect tools
const {
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

// sqlite database
const { Pnl } = require("./models");

// import functions from controllers
const shuffledRandomNumbers = require("./controller/generateRandomNum");
const getTokenAccounts = require("./controller/gettokenaccounts");
const swap = require("./controller/swap");

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

// global flag, variable
var timeoutId = null;
var executeBuy = true;
var executeSell = true;
const WrapSOL = "So11111111111111111111111111111111111111112";

// web3 connect
const connection = new Connection(
  "https://spring-capable-tent.solana-mainnet.quiknode.pro/6a3fa9f48cd11ebaa96901b009e38a33aa1968b1/",
  "confirmed"
);

// Shuffle the array
let shuffledNumbers = shuffledRandomNumbers(WALLET_SECRET_KEY);
console.log("first generate", shuffledNumbers);

// execute swap transcation several times
const executeTransaction = async (
  input,
  output,
  inputAmount,
  index,
  timestamp,
  Decimal,
  option
) => {
  // let shuffledNumbers = shuffledRandomNumbers(WALLET_SECRET_KEY);
  console.log("walletrasnaction" + (index + 1), shuffledNumbers);
  if (index < WALLET_SECRET_KEY.length) {
    // Generate a random number between MaxVal and MinVal
    const randomNumber = (
      Math.random() * (Number(inputAmount.max) - Number(inputAmount.min)) +
      Number(inputAmount.min)
    ).toFixed(6);
    let InAmount = Math.pow(10, Decimal) * randomNumber;
    InAmount = Math.ceil(InAmount);
    console.log(`wallet${shuffledNumbers[index]}'s inputamount`, InAmount);
    await swap(input, output, InAmount, shuffledNumbers[index], option);
    console.log(
      "timeoutId after swapping",
      "buy===",
      executeBuy,
      "sell=====",
      executeSell
    );
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

    shuffledNumbers = shuffledRandomNumbers(WALLET_SECRET_KEY);
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
  const { tokenaddress, maxVal, minVal, timestamp, stop, option } = req.query;

  console.log("option", option);
  console.log("maxVal=", maxVal, "minVal=", minVal);
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

app.get("/manual", async (req, res) => {
  const { option, amount, tokenaddress } = req.query;
  let input = null;
  let output = null;

  let tokeninfo = await connection.getParsedAccountInfo(
    new PublicKey(tokenaddress)
  );

  // all the token data is here
  let Decimal = option == "buy" ? 9 : tokeninfo.value.data.parsed.info.decimals;
  console.log("Decimal=", Decimal);
  const InAmount = (
    (Math.pow(10, Decimal) * amount) /
    WALLET_SECRET_KEY.length
  ).toFixed(6);

  if (option == "buy") {
    input = WrapSOL;
    output = tokenaddress;
  } else if (option == "sell") {
    input = tokenaddress;
    output = WrapSOL;
  }

  for (let index = 0; index < WALLET_SECRET_KEY.length; index++) {
    console.log("Manual", InAmount);

    // await swap(input, output, InAmount, index, option);
  }
  console.log("manual finished");
  res.json("manual");
});

app.get("/load", async (req, res) => {
  const { token_address } = req.query;
  let tableData = [];
  const getItem = async (private_key) => {
    const wallet = Keypair.fromSecretKey(bs58.decode(private_key.secret_key));
    console.log("wallet", wallet.publicKey);
    const wallet_address = wallet.publicKey.toString();
    const balanceInLamports = await connection.getBalance(wallet.publicKey);
    const wallet_SOL = balanceInLamports / LAMPORTS_PER_SOL;
    const tokenAmount = await getTokenAccounts(
      wallet_address,
      connection,
      token_address
    );
    const pnl = await Pnl.sum("sol", {
      where: {
        wallet_address: wallet_address,
      },
    });
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
  res.json(tableData);
});

app.get("/sellsall", async (req, res) => {
  const { tokenaddress, token_amount_list } = req.query;
  const input = tokenaddress;
  let tokeninfo = await connection.getParsedAccountInfo(
    new PublicKey(tokenaddress)
  );

  // all the token data is here
  let Decimal = tokeninfo.value.data.parsed.info.decimals;
  console.log("Decimal=", Decimal);

  const output = WrapSOL;
  const option = "sell";
  console.log(token_amount_list);
  for (let index = 0; index < token_amount_list.length; index++) {
    let InAmount = Math.pow(10, Decimal) * Number(token_amount_list[index]);
    if (InAmount > 0) {
      await swap(input, output, InAmount, index, option);
    } else {
      console.log("Already Sold");
    }
    console.log(token_amount_list[index]);
  }
  console.log("all positions ended");
  res.json("All positions end");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server started on port ${PORT}`));

module.exports = app;
