const { ethers } = require('ethers');
require('dotenv').config(); 
const {MNEMONIC, MORPH_RPC_URL, CONTRACT_ADDRESS} = process.env;

const storageContractAddress = require('../contracts/contractAddress.js');
const abi = require('../contracts/userData.abi.json').abi;

// Validate
if (!MNEMONIC) throw new Error("MNEMONIC is not set in .env");
if (!MORPH_RPC_URL) throw new Error("MORPH_RPC_URL is not set in .env");

const provider = new ethers.JsonRpcProvider(MORPH_RPC_URL);

// ✅ Create wallet from mnemonic
const wallet = ethers.Wallet.fromPhrase(MNEMONIC).connect(provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

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
