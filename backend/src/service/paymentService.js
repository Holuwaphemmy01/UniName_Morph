// // paymentService.js - Refactored for easier testing
// const { ethers } = require('ethers');
// const paymentAbi = require('../contracts/payment/paymentData.abi.json').abi;



// const createPaymentService = (provider, signer, contractAddress) => {
//   const paymentContract = new ethers.Contract(contractAddress, paymentAbi, signer);
  
//   return {
//     sendRegistrationPayment: async (amountInEth, adminAddress) => {
//       const amount = ethers.parseEther(amountInEth.toString());
//       const tx = await paymentContract.sendPayment(amount, adminAddress, { value: amount });
//       return tx.wait();
//     }
//   };
// };

// // Default export for production use
// const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
// const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// const paymentService = createPaymentService(provider, signer, process.env.PAYMENT_CONTRACT_ADDRESS);

// module.exports = {
//   sendRegistrationPayment: paymentService.sendRegistrationPayment,
//   createPaymentService // Export factory for testing
// };


// paymentService.js - Supports TEST_MODE and mnemonic or private key
const { ethers } = require('ethers');
const paymentAbi = require('../contracts/payment/paymentData.abi.json').abi;

const createPaymentService = (provider, signer, contractAddress) => {
  const paymentContract = new ethers.Contract(contractAddress, paymentAbi, signer);

  return {
    sendRegistrationPayment: async (amountInEth, adminAddress) => {
      const amount = ethers.parseEther(amountInEth.toString());
      const tx = await paymentContract.sendPayment(amount, adminAddress, { value: amount });
      return tx.wait();
    }
  };
};

let paymentService;

if (process.env.TEST_MODE === 'true') {
  // Mock payment service for tests
  paymentService = {
    sendRegistrationPayment: async () => {
      console.log('💡 Mock payment transaction');
      return { status: 1, mock: true };
    }
  };
} else {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  let signer;
  if (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.startsWith('0x')) {
    signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  } else if (process.env.MNEMONIC) {
    signer = ethers.Wallet.fromPhrase(process.env.MNEMONIC, provider);
  } else {
    throw new Error('❌ No valid PRIVATE_KEY or MNEMONIC found in env');
  }

  paymentService = createPaymentService(provider, signer, process.env.PAYMENT_CONTRACT_ADDRESS);
}

module.exports = {
  sendRegistrationPayment: paymentService.sendRegistrationPayment,
  createPaymentService
};
