import { ethers } from "ethers";
import { STORAGE_CONTRACT_ADDRESS } from "../contracts/contractAddress.js";
import abi from "../contracts/userData.abi.json";
import { MORPH_RPC_URL, PRIVATE_KEY } from "../config/index.js";

const provider = new ethers.JsonRpcProvider(MORPH_RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(STORAGE_CONTRACT_ADDRESS, abi, wallet);

export default contract;
