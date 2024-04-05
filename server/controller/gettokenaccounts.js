const { TOKEN_PROGRAM_ID } = require("@solana/spl-token");

const getTokenAccounts = async (wallet, connection, tokenaddress) => {
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

module.exports = getTokenAccounts;
