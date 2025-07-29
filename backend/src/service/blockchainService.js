const {ethers} = require('ethers');
const storageContractAddress = require('../contracts/contractAddress.js').default;
const abi = require('./contracts/userData.abi.json');



const provider = new ethers.JsonRpcProvider(process.env.MORPH_PROVIDER_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(storageContractAddress, abi, wallet);

async function saveData(data) {
  const tx = await contract.saveData(data);
  return tx;
}

async function updateData(data) {
  const tx = await contract.updateData(data);
  return tx;
}

module.exports={saveData, updateData};

