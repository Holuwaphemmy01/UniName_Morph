jest.mock('../src/service/redisClient.js', () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  quit: jest.fn()
}));

// ✅ Mock payment service to prevent real blockchain interaction
jest.mock('../src/service/paymentService.js', () => ({
  sendRegistrationPayment: jest.fn(() => Promise.resolve(true))
}));

// ✅ Mock blockchain service to prevent hanging in tx.wait()
jest.mock('../src/service/blockchainService.js', () => ({
  updateData: jest.fn(() => Promise.resolve({ wait: jest.fn(() => Promise.resolve(true)) })),
  saveData: jest.fn(() => Promise.resolve({ wait: jest.fn(() => Promise.resolve(true)) }))
}));

const redis = require('../src/service/redisClient.js');
const userRegistry = require('../src/service/userRegistryService.js');

describe('User Registry Service', () => {
  const redisKey = 'userDataArray';

  const sampleUser = {
    username: 'femi.eth',
    walletAddress: '0xabc123456789abcdef',
    chain: 'eth',
    amountInEth: '0.01',
    nonce: 0,
    adminAddress: '0x1234567890123456789012345678901234567890'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TEST_MODE = 'true';
  });

  describe('getAllUsers', () => {
    test('should return empty array when no users exist', async () => {
      redis.get.mockResolvedValue(null);

      const result = await userRegistry.getAllUsers();

      expect(result).toEqual([]);
      expect(redis.get).toHaveBeenCalledWith(redisKey);
    });

    test('should return parsed users array when data exists', async () => {
      const mockUsers = [sampleUser];
      redis.get.mockResolvedValue(JSON.stringify(mockUsers));

      const result = await userRegistry.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(redis.get).toHaveBeenCalledWith(redisKey);
    });
  });

  describe('registerUser', () => {
    test('should register a new user and store in Redis', async () => {
      // Simulate "data exists on chain"
      redis.get.mockImplementation((key) => {
        if (key === 'DATA_EXISTS_ON_CHAIN') return Promise.resolve('true');
        return Promise.resolve(null); // no users yet
      });

      await userRegistry.registerUser(sampleUser);

      expect(redis.set).toHaveBeenCalled(); // Data was saved
    }, 10000);

    test('should throw if username already exists', async () => {
      const existing = [sampleUser];
      redis.get.mockResolvedValueOnce(JSON.stringify(existing));

      await expect(userRegistry.registerUser(sampleUser)).rejects.toThrow(/Username already taken/);
    });
  });

  describe('resetUserRegistry', () => {
    test('should clear Redis user data', async () => {
      await userRegistry.resetUserRegistry();

      expect(redis.del).toHaveBeenCalledWith(redisKey);
    });
  });
});



