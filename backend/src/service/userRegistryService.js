const redis = require('./redisClient.js');
const { encryptAES } = require('./encryptionService.js');
const contract = process.env.TEST_MODE === 'true'
  ? { updateData: async () => ({ wait: async () => {} }) }
  : require('./blockchainService.js');

const { sendRegistrationPayment } = require('./paymentService.js'); // <-- payment logic
const REDIS_KEY = 'userDataArray';

async function getAllUsers() {
  const data = await redis.get(REDIS_KEY);
  return data ? JSON.parse(data) : [];
}

async function saveAllUsers(updatedUsers) {
  await redis.set(REDIS_KEY, JSON.stringify(updatedUsers));

  const encrypted = encryptAES(updatedUsers);

  const exists = await redis.get('DATA_EXISTS_ON_CHAIN');
  if (!exists) {
    throw new Error('Data does not exist on chain');
  }

  let tx;
  if (exists) {
    tx = await contract.updateData(encrypted);
  } else {
    tx = await contract.saveData(encrypted);
    await redis.set('DATA_EXISTS_ON_CHAIN', 'true');
  }

  await tx.wait();
}

async function isUsernameTaken(username) {
  const users = await getAllUsers();
  return users.some(user => user.username === username);
}

async function registerUser({ username, chain, walletAddress, amountInEth, adminAddress, signer }) {
  const users = await getAllUsers();

  if (users.some(user => user.username === username)) {
    throw new Error('Username already taken');
  }

  // 🔐 Step 1: Handle Payment Before Registration
  await sendRegistrationPayment(amountInEth, adminAddress, signer);

  // 🧾 Step 2: Proceed with Registration
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

async function resetUserRegistry() {
  await redis.del(REDIS_KEY);
}

module.exports = {
  resetUserRegistry,
  registerUser,
  isUsernameTaken,
  getAllUsers
};
