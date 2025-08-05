const redis = require('./redisClient.js');
const { encryptAES } = require('./encryptionService.js');
const contract = process.env.TEST_MODE === 'true'
  ? { updateData: async () => ({ wait: async () => {} }) }
  : require('./blockchainService.js');

const REDIS_KEY = 'userDataArray';

// Load all users from Redis (or initialize from on-chain if empty - to be added)
async function getAllUsers() {
  const data = await redis.get(REDIS_KEY);
  return data ? JSON.parse(data) : [];
}



async function saveAllUsers(updatedUsers) {
  await redis.set(REDIS_KEY, JSON.stringify(updatedUsers));

  const encrypted = encryptAES(updatedUsers);

  // Check if data exists on chain 
  const exists = await redis.get('DATA_EXISTS_ON_CHAIN');
  if (!exists) {
    throw new Error('Data does not exist on chain');
  }

  let tx;
  if (exists) {
    tx = await contract.updateData(encrypted);
  } else {
    tx = await contract.saveData(encrypted);
    await redis.set('DATA_EXISTS_ON_CHAIN', 'true'); // mark that data now exists
  }

  await tx.wait();
}


// Check if username already exists
async function isUsernameTaken(username) {
  const users = await getAllUsers();
  return users.some(user => user.username === username);
}

// Register new user
async function registerUser({ username, chain, walletAddress }) {
  const users = await getAllUsers();

  if (users.some(user => user.username === username)) {
    throw new Error('Username already taken');
  }

  const newUser = {
    username,
    wallets: {
      [chain]: [walletAddress]
    }
  };

  const updatedUsers = [...users, newUser];
  await saveAllUsers(updatedUsers);

  return true;
}

// Clear Redis for testing
async function resetUserRegistry() {
  await redis.del(REDIS_KEY);
}

module.exports = {
  resetUserRegistry,
  registerUser,
  isUsernameTaken,
  getAllUsers
};
