const redis = require('./redisClient');
const redisKey = 'userDataArray';

/**
 * Update the list of wallets for an existing user.
 * 
 * @param {string} baseUsername - The base username (without .eth/.sol suffix)
 * @param {string} chain - The blockchain type (eth, sol, sui, etc.)
 * @param {string} walletAddress - The new wallet address to add
 * @returns {Promise<string>} - The generated mapped username (e.g. ade.sol1)
 */
async function updateListOfWallet(baseUsername, chain, walletAddress) {
  if (!baseUsername || !chain || !walletAddress) {
    throw new Error('Base username, chain, and wallet address are required');
  }

  // Get all users from Redis
  let users = await redis.get(redisKey);
  users = users ? JSON.parse(users) : [];

  // Find all usernames starting with this base for the same chain
  const chainUsernames = users
    .filter(u => u.username.startsWith(`${baseUsername}.${chain}`))
    .map(u => u.username);

  let newUsername;

  if (chainUsernames.length === 0) {
    // First wallet for this chain
    newUsername = `${baseUsername}.${chain}`;
  } else {
    // Find the highest suffix
    const suffixes = chainUsernames
      .map(name => {
        const match = name.match(new RegExp(`^${baseUsername}\\.${chain}(\\d+)?$`));
        return match && match[1] ? parseInt(match[1], 10) : 0;
      });
    const maxSuffix = Math.max(...suffixes);
    newUsername = `${baseUsername}.${chain}${maxSuffix + 1}`;
  }

  // Save to Redis
  users.push({
    username: newUsername,
    wallets: { [chain]: [walletAddress] }
  });

  await redis.set(redisKey, JSON.stringify(users));

  return newUsername;
}

module.exports = updateListOfWallet;
