const { ethers } = require("ethers");
const sinon = require("sinon");

// const createMockProvider = () => {
//   const provider = new ethers.JsonRpcProvider();
//   sinon.stub(provider, "getBlockNumber").resolves(123);
//   return provider;
// };

// const createMockContract = (abi, wallet) => {
//   // const contract = new ethers.Contract("0x0000000000000000000000000000000000000000", abi, wallet);
//   // return contract;
// };



function createMockProvider() {
  return {
    send: async () => Promise.resolve(),
    getNetwork: async () => Promise.resolve({ chainId: 2810 })
  };
}

function createMockContract(abi, wallet) {
  return {
    saveData: async () => ({ wait: async () => ({}) }),
    updateData: async () => ({ wait: async () => ({}) }),
    getData: async () => "0x1234567890abcdef"
  };
}

module.exports = { createMockProvider, createMockContract };
