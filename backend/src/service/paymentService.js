// // paymentService.js
// const { ethers } = require('ethers');
// const paymentAbi = require('../contracts/payment/paymentData.abi.json').abi; // Ensure this path is correct

// const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
// const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// const paymentContractAddress = process.env.PAYMENT_CONTRACT_ADDRESS;
// const paymentContract = new ethers.Contract(paymentContractAddress, paymentAbi, signer);

// async function sendRegistrationPayment(amountInEth, adminAddress) {
//   const amount = ethers.parseEther(amountInEth.toString());
//   const tx = await paymentContract.sendPayment(amount, adminAddress, { value: amount });
//   return tx.wait();
// }

// //module.exports = { sendRegistrationPayment };
// module.exports = {
//   sendRegistrationPayment
//  //sendRegistrationPayment: jest.fn(async () => true),
// };



// paymentService.js - Refactored for easier testing
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

// Default export for production use
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const paymentService = createPaymentService(provider, signer, process.env.PAYMENT_CONTRACT_ADDRESS);

module.exports = {
  sendRegistrationPayment: paymentService.sendRegistrationPayment,
  createPaymentService // Export factory for testing
};