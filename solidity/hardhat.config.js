require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.0",  // Change this to ^0.8.0
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: ["6b86e2b372de7b05caa0d42e982bce0e46103256843c4f989c320efa11589fb8"]
    }
  }
};
