require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.0",  // Change this to ^0.8.0
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: ["dbd88bc0cc01a5bb295a3f87e5ee08c04a3ae63d0a50151d918f233af1487e07"]
    }
  }
};
