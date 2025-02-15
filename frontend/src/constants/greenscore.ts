export const CONTRACT_ADDRESS = "0xa31978E578b51B5aE96a802D194A198ff883a035";

export const CONTRACT_ABI = [
    {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "company",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "newScore",
            "type": "uint256"
          }
        ],
        "name": "GreenScoreUpdated",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "companies",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "greenScore",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalCreditsSold",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalCreditsBought",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "emissionsReduced",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "company",
            "type": "address"
          }
        ],
        "name": "getGreenScore",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "company",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "creditsSold",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "creditsBought",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "emissionsReduced",
            "type": "uint256"
          }
        ],
        "name": "updateGreenScore",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
];
