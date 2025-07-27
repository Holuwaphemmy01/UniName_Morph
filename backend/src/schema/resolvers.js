const { ethers } = require("ethers");
const { createHash, createCipheriv } = require("crypto");
const UniUser = require("../models/UniUser");
const StorageContract = require("../contract-interfaces/StorageContract.json");

// In-memory array (replace with Redis for persistence)
let usersArray = [];

// Load environment variables
require("dotenv").config();
const provider = new ethers.JsonRpcProvider(process.env.MORPH_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
let storageContract = new ethers.Contract(
  process.env.STORAGE_CONTRACT_ADDRESS,
  StorageContract.abi,
  wallet
);

// Encryption settings
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // 32 bytes for AES-256
const IV = Buffer.from(process.env.ENCRYPTION_IV, "hex"); // 16 bytes

// Utility to validate Ethereum address
const isValidAddress = (address) => {
  return ethers.isAddress(address);
};

// Utility to convert UniUser array to plain objects
const convertUsersToPlain = (users) => {
  return users.map(user => ({
    username: user.getUsername(),
    morphAddress: user.getMorphAddress(),
    listOfAddress: user.getListOfAddress()
  }));
};

module.exports = {
  Query: {
    // Retrieve the stored hash from StorageContract
    getUserListHash: async () => {
      return await storageContract.getData();
    },
    // Retrieve a user by username (off-chain, from array)
    getUser: async (_, { username }) => {
      const user = usersArray.find(u => u.getUsername() === username);
      if (!user) throw new Error("User not found");
      return {
        username: user.getUsername(),
        morphAddress: user.getMorphAddress(),
        listOfAddress: user.getListOfAddress()
      };
    }
  },
  Mutation: {
    // Save the UniUser array as a hash on-chain
    saveUserArray: async (_, { users }) => {
      // Validate inputs
      if (!users || users.length === 0) throw new Error("Users array cannot be empty");
      users.forEach(user => {
        if (!user.username) throw new Error("Username is required");
        if (!isValidAddress(user.morphAddress)) throw new Error("Invalid Morph address");
        if (user.listOfAddress) {
          user.listOfAddress.forEach(({ chainName, address }) => {
            if (!chainName || !isValidAddress(address)) throw new Error("Invalid chain address");
          });
        }
      });

      // Create UniUser instances
      usersArray = users.map(user => {
        const uniUser = new UniUser();
        uniUser.setUsername(user.username);
        uniUser.setMorphAddress(user.morphAddress);
        if (user.listOfAddress) {
          user.listOfAddress.forEach(({ chainName, address }) => {
            uniUser.setListOfAddress(chainName, address);
          });
        }
        return uniUser;
      });

      // Stringify the array
      const plainUsers = convertUsersToPlain(usersArray);
      const jsonString = JSON.stringify(plainUsers);

      // Encrypt the string
      const cipher = createCipheriv("aes-256-cbc", ENCRYPTION_KEY, IV);
      let encrypted = cipher.update(jsonString, "utf8", "hex");
      encrypted += cipher.final("hex");

      // Hash the encrypted data
      const hash = createHash("sha256").update(encrypted).digest("hex");

      // Store the hash in StorageContract
      const tx = await storageContract.saveData(hash);
      await tx.wait();

      // Store encrypted data off-chain
      process.env.ENCRYPTED_USERS = encrypted;

      return hash;
    },
    // Update the UniUser array and store new hash
    updateUserArray: async (_, { users }) => {
      // Validate inputs
      if (!users || users.length === 0) throw new Error("Users array cannot be empty");
      users.forEach(user => {
        if (!user.username) throw new Error("Username is required");
        if (!isValidAddress(user.morphAddress)) throw new Error("Invalid Morph address");
        if (user.listOfAddress) {
          user.listOfAddress.forEach(({ chainName, address }) => {
            if (!chainName || !isValidAddress(address)) throw new Error("Invalid chain address");
          });
        }
      });

      // Update UniUser array
      usersArray = users.map(user => {
        const uniUser = new UniUser();
        uniUser.setUsername(user.username);
        uniUser.setMorphAddress(user.morphAddress);
        if (user.listOfAddress) {
          user.listOfAddress.forEach(({ chainName, address }) => {
            uniUser.setListOfAddress(chainName, address);
          });
        }
        return uniUser;
      });

      // Stringify, encrypt, and hash
      const plainUsers = convertUsersToPlain(usersArray);
      const jsonString = JSON.stringify(plainUsers);
      const cipher = createCipheriv("aes-256-cbc", ENCRYPTION_KEY, IV);
      let encrypted = cipher.update(jsonString, "utf8", "hex");
      encrypted += cipher.final("hex");
      const hash = createHash("sha256").update(encrypted).digest("hex");

      // Update hash in StorageContract
      const tx = await storageContract.updateData(hash);
      await tx.wait();

      // Update encrypted data off-chain
      process.env.ENCRYPTED_USERS = encrypted;

      return hash;
    },
    // Add a single user to the array
    addUser: async (_, { username, morphAddress, listOfAddress }) => {
      // Validate inputs
      if (!username) throw new Error("Username is required");
      if (!isValidAddress(morphAddress)) throw new Error("Invalid Morph address");
      if (listOfAddress) {
        listOfAddress.forEach(({ chainName, address }) => {
          if (!chainName || !isValidAddress(address)) throw new Error("Invalid chain address");
        });
      }

      // Create new UniUser
      const uniUser = new UniUser();
      uniUser.setUsername(username);
      uniUser.setMorphAddress(morphAddress);
      if (listOfAddress) {
        listOfAddress.forEach(({ chainName, address }) => {
          uniUser.setListOfAddress(chainName, address);
        });
      }

      // Add to array
      usersArray.push(uniUser);

      // Stringify, encrypt, and hash
      const plainUsers = convertUsersToPlain(usersArray);
      const jsonString = JSON.stringify(plainUsers);
      const cipher = createCipheriv("aes-256-cbc", ENCRYPTION_KEY, IV);
      let encrypted = cipher.update(jsonString, "utf8", "hex");
      encrypted += cipher.final("hex");
      const hash = createHash("sha256").update(encrypted).digest("hex");

      // Update hash in StorageContract
      const tx = await storageContract.saveData(hash);
      await tx.wait();

      // Update encrypted data off-chain
      process.env.ENCRYPTED_USERS = encrypted;

      return {
        username,
        morphAddress,
        listOfAddress: listOfAddress || []
      };
    }
  }
};

module.exports.setStorageContract = (contract) => { storageContract = contract; };
module.exports.setUsersArray = (array) => { usersArray = array; };