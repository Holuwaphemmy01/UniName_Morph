const { ethers } = require('ethers');
require('dotenv').config(); // load .env variables

const storageContractAddress = require('../contracts/contractAddress.js');
const abi = require('../contracts/userData.abi.json').abi;

// Read environment variables
const MNEMONIC = process.env.MNEMONIC;
const RPC_URL = process.env.MORPH_RPC_URL;

// Validate
if (!MNEMONIC) throw new Error("MNEMONIC is not set in .env");
if (!RPC_URL) throw new Error("MORPH_RPC_URL is not set in .env");

const provider = new ethers.JsonRpcProvider(RPC_URL);

// ✅ Create wallet from mnemonic
const wallet = ethers.Wallet.fromPhrase(MNEMONIC).connect(provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);



// Initialize contract
// const contract = new ethers.Contract(storageContractAddress, abi, wallet);

// Functions
async function saveData(data) {
  const tx = await contract.saveData(data);
  return tx;
}

async function updateData(data) {
  const tx = await contract.updateData(data);
  return tx;
}

module.exports = { saveData, updateData };
