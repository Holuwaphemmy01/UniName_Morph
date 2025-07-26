const { ethers } = require("ethers");
const sinon = require("sinon");

const createMockProvider = () => {
  const provider = new ethers.JsonRpcProvider();
  sinon.stub(provider, "getBlockNumber").resolves(123);
  return provider;
};

const createMockContract = (abi, wallet) => {
  const contract = new ethers.Contract("0x0000000000000000000000000000000000000000", abi, wallet);
  return contract;
};

module.exports = { createMockProvider, createMockContract };