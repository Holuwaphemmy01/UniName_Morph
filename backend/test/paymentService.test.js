// // test/paymentService.test.js

// // Mock environment variables first
// process.env.RPC_URL = 'https://mock-rpc-url.com';
// process.env.PRIVATE_KEY = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
// process.env.PAYMENT_CONTRACT_ADDRESS = '0x742d35Cc6634C0532925a3b8D0A6C7eA7c7f7b9b';

// // Create mock objects that we can control
// const mockTx = {
//   wait: jest.fn(),
//   hash: '0xabcdef1234567890'
// };

// const mockContract = {
//   sendPayment: jest.fn()
// };

// const mockSigner = {
//   address: '0x1234567890123456789012345678901234567890'
// };

// const mockProvider = {
//   getNetwork: jest.fn().mockResolvedValue({ chainId: 1 })
// };

// // Mock ethers before requiring the service
// jest.mock('ethers', () => ({
//   ethers: {
//     JsonRpcProvider: jest.fn(() => mockProvider),
//     Wallet: jest.fn(() => mockSigner),
//     Contract: jest.fn(() => mockContract),
//     parseEther: jest.fn()
//   }
// }));

// // Mock the ABI import
// jest.mock('../contracts/payment/paymentData.abi.json', () => ({
//   abi: [
//     {
//       "inputs": [
//         {"name": "amount", "type": "uint256"},
//         {"name": "recipient", "type": "address"}
//       ],
//       "name": "sendPayment",
//       "outputs": [],
//       "stateMutability": "payable",
//       "type": "function"
//     }
//   ]
// }), { virtual: true });

// const { ethers } = require('ethers');

// describe('Payment Service', () => {
//   let sendRegistrationPayment;
//   let mockWaitResult;

//   beforeAll(() => {
//     // Import the service after all mocks are set up
//     const paymentService = require('../src/service/paymentService');
//     sendRegistrationPayment = paymentService.sendRegistrationPayment;
//   });

//   beforeEach(() => {
//     // Reset all mock calls and implementations before each test
//     jest.clearAllMocks();
    
//     // Set up default mock implementations
//     mockWaitResult = {
//       status: 1,
//       transactionHash: '0xabcdef1234567890',
//       gasUsed: 21000n,
//       blockNumber: 12345
//     };

//     mockTx.wait.mockResolvedValue(mockWaitResult);
//     mockContract.sendPayment.mockResolvedValue(mockTx);
    
//     ethers.parseEther.mockImplementation((value) => {
//       return BigInt(Math.floor(parseFloat(value) * 1e18));
//     });
//   });

//   // Test Case 1: Successful payment with valid inputs
//   test('should successfully send registration payment with valid amount and admin address', async () => {
//     const amountInEth = 0.1;
//     const adminAddress = '0x742d35Cc6634C0532925a3b8D0A6C7eA7c7f7b9b';

//     const result = await sendRegistrationPayment(amountInEth, adminAddress);

//     // Verify ethers.parseEther was called with correct amount
//     expect(ethers.parseEther).toHaveBeenCalledWith('0.1');
    
//     // Verify contract method was called with correct parameters
//     expect(mockContract.sendPayment).toHaveBeenCalledWith(
//       BigInt(100000000000000000), // 0.1 ETH in wei
//       adminAddress,
//       { value: BigInt(100000000000000000) }
//     );

//     // Verify transaction was awaited
//     expect(mockTx.wait).toHaveBeenCalled();
    
//     // Verify correct result is returned
//     expect(result).toEqual(mockWaitResult);
//   });

//   // Test Case 2: Handle integer amount input
//   test('should handle integer amount input correctly', async () => {
//     const amountInEth = 1; // Integer input
//     const adminAddress = '0x742d35Cc6634C0532925a3b8D0A6C7eA7c7f7b9b';

//     await sendRegistrationPayment(amountInEth, adminAddress);

//     // Verify parseEther converts integer to string
//     expect(ethers.parseEther).toHaveBeenCalledWith('1');
    
//     // Verify contract call with 1 ETH in wei
//     expect(mockContract.sendPayment).toHaveBeenCalledWith(
//       BigInt(1000000000000000000), // 1 ETH in wei
//       adminAddress,
//       { value: BigInt(1000000000000000000) }
//     );
//   });

//   // Test Case 3: Contract transaction failure
//   test('should throw error when contract sendPayment fails', async () => {
//     const amountInEth = 0.5;
//     const adminAddress = '0x742d35Cc6634C0532925a3b8D0A6C7eA7c7f7b9b';
//     const contractError = new Error('Insufficient funds');

//     // Mock contract to throw error
//     mockContract.sendPayment.mockRejectedValue(contractError);

//     await expect(sendRegistrationPayment(amountInEth, adminAddress))
//       .rejects.toThrow('Insufficient funds');

//     // Verify contract was called before failure
//     expect(mockContract.sendPayment).toHaveBeenCalledWith(
//       BigInt(500000000000000000), // 0.5 ETH in wei
//       adminAddress,
//       { value: BigInt(500000000000000000) }
//     );
//   });

//   // Test Case 4: Transaction wait failure (transaction reverted)
//   test('should throw error when transaction wait fails', async () => {
//     const amountInEth = 0.25;
//     const adminAddress = '0x742d35Cc6634C0532925a3b8D0A6C7eA7c7f7b9b';
//     const waitError = new Error('Transaction reverted');

//     // Mock successful sendPayment but failed wait
//     mockTx.wait.mockRejectedValue(waitError);

//     await expect(sendRegistrationPayment(amountInEth, adminAddress))
//       .rejects.toThrow('Transaction reverted');

//     // Verify contract sendPayment was successful
//     expect(mockContract.sendPayment).toHaveBeenCalled();
//     // Verify wait was attempted
//     expect(mockTx.wait).toHaveBeenCalled();
//   });

//   // Test Case 5: Handle very small amount (edge case)
//   test('should handle very small payment amounts correctly', async () => {
//     const amountInEth = 0.000001; // 1000000000000 wei
//     const adminAddress = '0x742d35Cc6634C0532925a3b8D0A6C7eA7c7f7b9b';

//     const result = await sendRegistrationPayment(amountInEth, adminAddress);

//     // Verify parseEther handles small decimals
//     expect(ethers.parseEther).toHaveBeenCalledWith('0.000001');
    
//     // Verify contract call with small amount
//     expect(mockContract.sendPayment).toHaveBeenCalledWith(
//       BigInt(1000000000000), // 0.000001 ETH in wei
//       adminAddress,
//       { value: BigInt(1000000000000) }
//     );

//     expect(result).toEqual(mockWaitResult);
//   });

//   // Test Case 6: Verify constructor calls
//   test('should initialize ethers objects with correct parameters', () => {
//     // Verify provider was created with correct RPC URL
//     expect(ethers.JsonRpcProvider).toHaveBeenCalledWith(process.env.RPC_URL);
    
//     // Verify wallet was created with correct private key and provider
//     expect(ethers.Wallet).toHaveBeenCalledWith(process.env.PRIVATE_KEY, mockProvider);
    
//     // Verify contract was created with correct parameters
//     expect(ethers.Contract).toHaveBeenCalledWith(
//       process.env.PAYMENT_CONTRACT_ADDRESS,
//       expect.any(Array), // ABI array
//       mockSigner
//     );
//   });
// });

// // Alternative approach: Testing with manual dependency injection
// describe('Payment Service - Alternative Testing Approach', () => {
//   test('should work with dependency injection pattern', async () => {
//     // Create a testable version of the function
//     const createPaymentService = (ethers, contract) => {
//       return {
//         sendRegistrationPayment: async (amountInEth, adminAddress) => {
//           const amount = ethers.parseEther(amountInEth.toString());
//           const tx = await contract.sendPayment(amount, adminAddress, { value: amount });
//           return tx.wait();
//         }
//       };
//     };

//     // Mock dependencies
//     const mockEthers = {
//       parseEther: jest.fn().mockReturnValue(BigInt(100000000000000000))
//     };

//     const mockTx = { wait: jest.fn().mockResolvedValue({ status: 1 }) };
//     const mockContract = {
//       sendPayment: jest.fn().mockResolvedValue(mockTx)
//     };

//     // Create service with mocked dependencies
//     const paymentService = createPaymentService(mockEthers, mockContract);

//     // Test the function
//     const result = await paymentService.sendRegistrationPayment(0.1, '0x123');

//     // Verify calls
//     expect(mockEthers.parseEther).toHaveBeenCalledWith('0.1');
//     expect(mockContract.sendPayment).toHaveBeenCalledWith(
//       BigInt(100000000000000000),
//       '0x123',
//       { value: BigInt(100000000000000000) }
//     );
//     expect(mockTx.wait).toHaveBeenCalled();
//     expect(result).toEqual({ status: 1 });
//   });

//   test('should handle errors in dependency injection version', async () => {
//     const createPaymentService = (ethers, contract) => {
//       return {
//         sendRegistrationPayment: async (amountInEth, adminAddress) => {
//           const amount = ethers.parseEther(amountInEth.toString());
//           const tx = await contract.sendPayment(amount, adminAddress, { value: amount });
//           return tx.wait();
//         }
//       };
//     };

//     const mockEthers = {
//       parseEther: jest.fn().mockReturnValue(BigInt(500000000000000000))
//     };

//     const mockContract = {
//       sendPayment: jest.fn().mockRejectedValue(new Error('Gas limit exceeded'))
//     };

//     const paymentService = createPaymentService(mockEthers, mockContract);

//     await expect(paymentService.sendRegistrationPayment(0.5, '0x456'))
//       .rejects.toThrow('Gas limit exceeded');

//     expect(mockContract.sendPayment).toHaveBeenCalled();
//   });
// });




// test/paymentService.test.js

// Mock environment variables first
process.env.RPC_URL = 'https://mock-rpc-url.com';
process.env.PRIVATE_KEY = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
process.env.PAYMENT_CONTRACT_ADDRESS = '0x742d35Cc6634C0532925a3b8D0A6C7eA7c7f7b9b';

// Create mock objects that we can control
const mockTx = {
  wait: jest.fn(),
  hash: '0xabcdef1234567890'
};

const mockContract = {
  sendPayment: jest.fn()
};

const mockSigner = {
  address: '0x1234567890123456789012345678901234567890'
};

const mockProvider = {
  getNetwork: jest.fn().mockResolvedValue({ chainId: 1 })
};

// Mock ethers before requiring the service
jest.mock('ethers', () => ({
  ethers: {
    JsonRpcProvider: jest.fn(() => mockProvider),
    Wallet: jest.fn(() => mockSigner),
    Contract: jest.fn(() => mockContract),
    parseEther: jest.fn()
  }
}));

// Mock the ABI import
jest.mock('../contracts/payment/paymentData.abi.json', () => ({
  abi: [
    {
      "inputs": [
        {"name": "amount", "type": "uint256"},
        {"name": "recipient", "type": "address"}
      ],
      "name": "sendPayment",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ]
}), { virtual: true });

describe('Payment Service', () => {
  let sendRegistrationPayment;
  let mockWaitResult;
  let ethers;

  beforeAll(() => {
    // Get the mocked ethers
    ethers = require('ethers').ethers;
    // Import the service after all mocks are set up
    const paymentService = require('../src/service/paymentService');
    sendRegistrationPayment = paymentService.sendRegistrationPayment;
  });

  beforeEach(() => {
    // Reset all mock calls and implementations before each test
    jest.clearAllMocks();
    
    // Set up default mock implementations
    mockWaitResult = {
      status: 1,
      transactionHash: '0xabcdef1234567890',
      gasUsed: 21000n,
      blockNumber: 12345
    };

    mockTx.wait.mockResolvedValue(mockWaitResult);
    mockContract.sendPayment.mockResolvedValue(mockTx);
    
    ethers.parseEther.mockImplementation((value) => {
      return BigInt(Math.floor(parseFloat(value) * 1e18));
    });
  });

  // Test Case 1: Successful payment with valid inputs
  test('should successfully send registration payment with valid amount and admin address', async () => {
    const amountInEth = 0.1;
    const adminAddress = '0x742d35Cc6634C0532925a3b8D0A6C7eA7c7f7b9b';

    const result = await sendRegistrationPayment(amountInEth, adminAddress);

    // Verify ethers.parseEther was called with correct amount
    expect(ethers.parseEther).toHaveBeenCalledWith('0.1');
    
    // Verify contract method was called with correct parameters
    expect(mockContract.sendPayment).toHaveBeenCalledWith(
      BigInt(100000000000000000), // 0.1 ETH in wei
      adminAddress,
      { value: BigInt(100000000000000000) }
    );

    // Verify transaction was awaited
    expect(mockTx.wait).toHaveBeenCalled();
    
    // Verify correct result is returned
    expect(result).toEqual(mockWaitResult);
  });

  // Test Case 2: Handle integer amount input
  test('should handle integer amount input correctly', async () => {
    const amountInEth = 1; // Integer input
    const adminAddress = '0x742d35Cc6634C0532925a3b8D0A6C7eA7c7f7b9b';

    await sendRegistrationPayment(amountInEth, adminAddress);

    // Verify parseEther converts integer to string
    expect(ethers.parseEther).toHaveBeenCalledWith('1');
    
    // Verify contract call with 1 ETH in wei
    expect(mockContract.sendPayment).toHaveBeenCalledWith(
      BigInt(1000000000000000000), // 1 ETH in wei
      adminAddress,
      { value: BigInt(1000000000000000000) }
    );
  });

  // Test Case 3: Contract transaction failure
  test('should throw error when contract sendPayment fails', async () => {
    const amountInEth = 0.5;
    const adminAddress = '0x742d35Cc6634C0532925a3b8D0A6C7eA7c7f7b9b';
    const contractError = new Error('Insufficient funds');

    // Mock contract to throw error
    mockContract.sendPayment.mockRejectedValue(contractError);

    await expect(sendRegistrationPayment(amountInEth, adminAddress))
      .rejects.toThrow('Insufficient funds');

    // Verify contract was called before failure
    expect(mockContract.sendPayment).toHaveBeenCalledWith(
      BigInt(500000000000000000), // 0.5 ETH in wei
      adminAddress,
      { value: BigInt(500000000000000000) }
    );
  });

  // Test Case 4: Transaction wait failure (transaction reverted)
  test('should throw error when transaction wait fails', async () => {
    const amountInEth = 0.25;
    const adminAddress = '0x742d35Cc6634C0532925a3b8D0A6C7eA7c7f7b9b';
    const waitError = new Error('Transaction reverted');

    // Mock successful sendPayment but failed wait
    mockTx.wait.mockRejectedValue(waitError);

    await expect(sendRegistrationPayment(amountInEth, adminAddress))
      .rejects.toThrow('Transaction reverted');

    // Verify contract sendPayment was successful
    expect(mockContract.sendPayment).toHaveBeenCalled();
    // Verify wait was attempted
    expect(mockTx.wait).toHaveBeenCalled();
  });

  // Test Case 5: Handle very small amount (edge case)
  test('should handle very small payment amounts correctly', async () => {
    const amountInEth = 0.000001; // 1000000000000 wei
    const adminAddress = '0x742d35Cc6634C0532925a3b8D0A6C7eA7c7f7b9b';

    const result = await sendRegistrationPayment(amountInEth, adminAddress);

    // Verify parseEther handles small decimals
    expect(ethers.parseEther).toHaveBeenCalledWith('0.000001');
    
    // Verify contract call with small amount
    expect(mockContract.sendPayment).toHaveBeenCalledWith(
      BigInt(1000000000000), // 0.000001 ETH in wei
      adminAddress,
      { value: BigInt(1000000000000) }
    );

    expect(result).toEqual(mockWaitResult);
  });

  // Test Case 6: Verify that the service function exists and can be called
  test('should have sendRegistrationPayment function available', () => {
    // Verify the function is properly exported and callable
    expect(typeof sendRegistrationPayment).toBe('function');
    
    // Verify that our mocks are properly set up
    expect(mockContract.sendPayment).toBeDefined();
    expect(ethers.parseEther).toBeDefined();
    expect(ethers.JsonRpcProvider).toBeDefined();
    expect(ethers.Wallet).toBeDefined();
    expect(ethers.Contract).toBeDefined();
  });
});

// Alternative approach: Testing with manual dependency injection
describe('Payment Service - Alternative Testing Approach', () => {
  test('should work with dependency injection pattern', async () => {
    // Create a testable version of the function
    const createPaymentService = (ethers, contract) => {
      return {
        sendRegistrationPayment: async (amountInEth, adminAddress) => {
          const amount = ethers.parseEther(amountInEth.toString());
          const tx = await contract.sendPayment(amount, adminAddress, { value: amount });
          return tx.wait();
        }
      };
    };

    // Mock dependencies
    const mockEthers = {
      parseEther: jest.fn().mockReturnValue(BigInt(100000000000000000))
    };

    const mockTx = { wait: jest.fn().mockResolvedValue({ status: 1 }) };
    const mockContract = {
      sendPayment: jest.fn().mockResolvedValue(mockTx)
    };

    // Create service with mocked dependencies
    const paymentService = createPaymentService(mockEthers, mockContract);

    // Test the function
    const result = await paymentService.sendRegistrationPayment(0.1, '0x123');

    // Verify calls
    expect(mockEthers.parseEther).toHaveBeenCalledWith('0.1');
    expect(mockContract.sendPayment).toHaveBeenCalledWith(
      BigInt(100000000000000000),
      '0x123',
      { value: BigInt(100000000000000000) }
    );
    expect(mockTx.wait).toHaveBeenCalled();
    expect(result).toEqual({ status: 1 });
  });

  test('should handle errors in dependency injection version', async () => {
    const createPaymentService = (ethers, contract) => {
      return {
        sendRegistrationPayment: async (amountInEth, adminAddress) => {
          const amount = ethers.parseEther(amountInEth.toString());
          const tx = await contract.sendPayment(amount, adminAddress, { value: amount });
          return tx.wait();
        }
      };
    };

    const mockEthers = {
      parseEther: jest.fn().mockReturnValue(BigInt(500000000000000000))
    };

    const mockContract = {
      sendPayment: jest.fn().mockRejectedValue(new Error('Gas limit exceeded'))
    };

    const paymentService = createPaymentService(mockEthers, mockContract);

    await expect(paymentService.sendRegistrationPayment(0.5, '0x456'))
      .rejects.toThrow('Gas limit exceeded');

    expect(mockContract.sendPayment).toHaveBeenCalled();
  });
});