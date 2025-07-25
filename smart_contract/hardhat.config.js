require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      // Local development network
    },
    morphHolesky: {
      url: process.env.MORPH_RPC_URL,
      accounts: {
        mnemonic: process.env.MNEMONIC || "",
        
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 10
      },
      chainId: 2810,
      gasPrice: 20000000000, 
    }
  },
  etherscan: {
    apiKey: {
      morphHolesky: process.env.ETHERSCAN_API_KEY || "dummy"
    },
    customChains: [
      {
        network: "morphHolesky",
        chainId: 2810,
        urls: {
          apiURL: "https://explorer-api-holesky.morphl2.io/api",
          browserURL: "https://explorer-holesky.morphl2.io"
        }
      }
    ]
  }
};