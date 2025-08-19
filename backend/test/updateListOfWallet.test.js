jest.mock('../src/service/redisClient.js', () => ({
  get: jest.fn(),
  set: jest.fn()
}));

const redis = require('../src/service/redisClient.js');
const updateListOfWallet = require('../src/service/updateListOfWallet');

describe('updateListOfWallet', () => {
  const redisKey = 'userDataArray';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should add first wallet for a chain with base username', async () => {
    redis.get.mockResolvedValue(null);

    const username = await updateListOfWallet('ade', 'eth', '0xabc');
    expect(username).toBe('ade.eth');
    expect(redis.set).toHaveBeenCalledWith(
      redisKey,
      JSON.stringify([{ username: 'ade.eth', wallets: { eth: ['0xabc'] } }])
    );
  });

  test('should add second wallet for same chain with incremented suffix', async () => {
    redis.get.mockResolvedValue(
      JSON.stringify([{ username: 'ade.eth', wallets: { eth: ['0xabc'] } }])
    );

    const username = await updateListOfWallet('ade', 'eth', '0xdef');
    expect(username).toBe('ade.eth1');
  });

  test('should add wallet for different chain without suffix', async () => {
    redis.get.mockResolvedValue(
      JSON.stringify([{ username: 'ade.eth', wallets: { eth: ['0xabc'] } }])
    );

    const username = await updateListOfWallet('ade', 'sol', 'sol1');
    expect(username).toBe('ade.sol');
  });

  test('should handle non-consecutive suffixes correctly', async () => {
    redis.get.mockResolvedValue(
      JSON.stringify([
        { username: 'ade.eth', wallets: { eth: ['0xabc'] } },
        { username: 'ade.eth5', wallets: { eth: ['0xzzz'] } }
      ])
    );

    const username = await updateListOfWallet('ade', 'eth', '0xnew');
    expect(username).toBe('ade.eth6');
  });

  test('should throw error if base username is missing', async () => {
    await expect(updateListOfWallet('', 'eth', '0xabc')).rejects.toThrow();
  });

  test('should throw error if chain is missing', async () => {
    await expect(updateListOfWallet('ade', '', '0xabc')).rejects.toThrow();
  });

  test('should throw error if wallet address is missing', async () => {
    await expect(updateListOfWallet('ade', 'eth', '')).rejects.toThrow();
  });

  test('should handle multiple chains correctly', async () => {
    redis.get.mockResolvedValue(
      JSON.stringify([
        { username: 'ade.eth', wallets: { eth: ['0xabc'] } },
        { username: 'ade.sol', wallets: { sol: ['sol1'] } }
      ])
    );

    const username = await updateListOfWallet('ade', 'eth', '0xdef');
    expect(username).toBe('ade.eth1');
  });

  test('should handle case with multiple suffix gaps', async () => {
    redis.get.mockResolvedValue(
      JSON.stringify([
        { username: 'ade.eth', wallets: { eth: ['0xabc'] } },
        { username: 'ade.eth1', wallets: { eth: ['0xdef'] } },
        { username: 'ade.eth10', wallets: { eth: ['0xghi'] } }
      ])
    );

    const username = await updateListOfWallet('ade', 'eth', '0xxyz');
    expect(username).toBe('ade.eth11');
  });

  test('should append wallet to list for same user object correctly', async () => {
    redis.get.mockResolvedValue(
      JSON.stringify([{ username: 'ade.sol', wallets: { sol: ['sol1'] } }])
    );

    const username = await updateListOfWallet('ade', 'sol', 'sol2');
    expect(username).toBe('ade.sol1');
  });
});
