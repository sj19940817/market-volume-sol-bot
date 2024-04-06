const WALLET_SECRET_KEY = require("../config/walllet.json");
const { Pnl } = require("../models");
const {
  Keypair,
  VersionedTransaction,
  Connection,
} = require("@solana/web3.js");
const bs58 = require("bs58");
const axios = require("axios");

const MSG = {
  confirmTransactionFailed: "🚩 Transaction is not confirmed!",
  waiting: "waiting...",
};

// web3 connect
const connection = new Connection(
  "https://spring-capable-tent.solana-mainnet.quiknode.pro/6a3fa9f48cd11ebaa96901b009e38a33aa1968b1/",
  "confirmed"
);

const swap = async (input, output, inputAmount, index, option) => {
  const wallet = Keypair.fromSecretKey(
    bs58.decode(WALLET_SECRET_KEY[index].secret_key)
  );
  const SLIPPAGE = 50;
  let quoteResponse = null;
  console.log(input, output, inputAmount, index);

  try {
    quoteResponse = await axios.get(
      `https://quote-api.jup.ag/v6/quote?inputMint=${input}&outputMint=${output}&amount=${inputAmount}&slippageBps=${SLIPPAGE}`
    );
  } catch (error) {
    console.error("quote-error", error);
  }
  console.log(
    `https://quote-api.jup.ag/v6/quote?inputMint=${input}&outputMint=${output}&amount=${inputAmount}&slippageBps=${SLIPPAGE}`
  );
  const quoteResponseData = quoteResponse.data;
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
        token_address: option == "buy" ? output : input,
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

module.exports = swap;
