import {ethers} from 'ethers';
const storageContractAddress = require('../contracts/contractAddress.js');
const abi = require('./contracts/userData.abi.json');



const provider = new ethers.JsonRpcProvider(process.env.MORPH_PROVIDER_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(storageContractAddress, abi, wallet);

export async function saveData(data) {
  const tx = await contract.saveData(data);
  return tx;
}

export async function updateData(data) {
  const tx = await contract.updateData(data);
  return tx;
}

