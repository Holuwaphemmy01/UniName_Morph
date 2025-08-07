// const redis = require('../src/service/redisClient.js');
// const userRegistry = require('../src/service/userRegistryService.js');

// describe('User Registry Service', () => {
//   const sampleUser = {
//     username: 'femi.eth',
//     walletAddress: '0xabc123456789abcdef',
//     chain: 'eth'
//   };

//   const redisKey = 'userDataArray';

//   beforeEach(async () => {
//     await redis.del(redisKey);
//   });

//   afterEach(async () => {
//     await redis.del(redisKey);
//   });

//   afterAll(async () => {
//     await redis.quit(); 
//   });

//   test('should register a new user and store in Redis', async () => {
//     const result = await userRegistry.registerUser(sampleUser);
//     expect(result).toBe(true);

//     const redisData = await redis.get(redisKey);
//     const parsed = JSON.parse(redisData);
//     expect(parsed.length).toBe(1);
//     expect(parsed[0].username).toBe(sampleUser.username);
//     expect(parsed[0].wallets.eth[0]).toBe(sampleUser.walletAddress);
//   }, 15000);

//   test('should reject registration if username already exists', async () => {
//     await userRegistry.registerUser(sampleUser);

//     await expect(userRegistry.registerUser(sampleUser))
//       .rejects
//       .toThrow(/Username already taken/);
//   }, 15000);

//   test('should allow multiple wallets per username variant', async () => {
//      await userRegistry.registerUser({ username: 'femi.eth', chain: 'eth', walletAddress: '0xwallet1' });
//      await userRegistry.registerUser({ username: 'femi.eth01', chain: 'eth', walletAddress: '0xwallet2' });
//      await userRegistry.registerUser({ username: 'femi.eth02', chain: 'eth', walletAddress: '0xwallet3' });

//     const redisData = JSON.parse(await redis.get(redisKey));
//     expect(redisData).not.toBeNull();
//     expect(redisData.length).toBe(3);
//     expect(redisData[1].username).toBe('femi.eth01');
//     expect(redisData[2].wallets.eth[0]).toBe('0xwallet3');
//   }, 15000);
// });




// jest.mock('../src/service/paymentService.js'); // 👈 must come first

// const redis = require('../src/service/redisClient.js');
// const userRegistry = require('../src/service/userRegistryService.js');
// const { Wallet, ethers } = require('ethers');




// describe('User Registry Service', () => {
//   const redisKey = 'userDataArray';
//   const wallet = ethers.Wallet.createRandom();

//   const signer = wallet.privateKey;

//   const sampleUser = {
//     username: 'femi',
//     chain: 'eth',
//     walletAddress: wallet,
//     amountInEth: ethers.utils.parseEther('0.11'),
//     adminAddress: '0x1234567890123456789012345678901234567890',
//     signer
//   };

//   beforeEach(async () => {
//     await redis.del(redisKey);
//   });

//   afterEach(async () => {
//     await redis.del(redisKey);
//   });

//   afterAll(async () => {
//     await redis.quit();
//   });

//   test('should register a new user and store in Redis', async () => {
    
//     const result = await userRegistry.registerUser(sampleUser);
//     expect(result).toBe(true);

//     const redisData = await redis.get(redisKey);
//     const parsed = JSON.parse(redisData);
//     expect(parsed.length).toBe(1);
//     expect(parsed[0].username).toBe(sampleUser.username);
//     expect(parsed[0].wallets.eth[0]).toBe(sampleUser.walletAddress);
//   }, 15000);

//   test('should reject registration if username already exists', async () => {
//     await userRegistry.registerUser(sampleUser);

//     await expect(userRegistry.registerUser(sampleUser))
//       .rejects
//       .toThrow(/Username already taken/);
//   }, 15000);

//   test('should allow multiple wallets per username variant', async () => {
//     await userRegistry.registerUser({ ...sampleUser, username: 'femi.eth', walletAddress: '0xwallet1' });
//     await userRegistry.registerUser({ ...sampleUser, username: 'femi.eth01', walletAddress: '0xwallet2' });
//     await userRegistry.registerUser({ ...sampleUser, username: 'femi.eth02', walletAddress: '0xwallet3' });

//     const redisData = JSON.parse(await redis.get(redisKey));
//     expect(redisData).not.toBeNull();
//     expect(redisData.length).toBe(3);
//     expect(redisData[1].username).toBe('femi.eth01');
//     expect(redisData[2].wallets.eth[0]).toBe('0xwallet3');
//   }, 15000);

//   test('should reset user registry', async () => {
//     const { sendRegistrationPayment } = require('../src/service/paymentService.js');
//     expect(sendRegistrationPayment).toHaveBeenCalled();
//   });
// });




//jest.mock('./blockchainService.js', () => mockContract);
jest.mock('../src/service/redisClient.js', () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  quit: jest.fn()
}));
const redis = require('../src/service/redisClient.js');
const userRegistry = require('../src/service/userRegistryService.js');

describe('User Registry Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TEST_MODE = 'false';
  });

  describe('getAllUsers', () => {
    test('should return empty array when no users exist', async () => {
      redis.get.mockResolvedValue(null);
      
      const result = await userRegistry.getAllUsers();
      
      expect(result).toEqual([]);
      expect(redis.get).toHaveBeenCalledWith('userDataArray');
    });

    test('should return parsed users array when data exists', async () => {
      const mockUsers = [{ username: 'testuser', wallets: { eth: ['0x123'] } }];
      redis.get.mockResolvedValue(JSON.stringify(mockUsers));
      
      const result = await userRegistry.getAllUsers();
      
      expect(result).toEqual(mockUsers);
      expect(redis.get).toHaveBeenCalledWith('userDataArray');
    });

  });

});