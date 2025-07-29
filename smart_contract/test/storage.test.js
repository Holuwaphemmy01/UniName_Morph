const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StorageContract", function () {
  let storage;
  let owner;

  beforeEach(async () => {
    const Storage = await ethers.getContractFactory("StorageContract");
    [owner] = await ethers.getSigners();
    storage = await Storage.deploy();
    await storage.waitForDeployment();
  });

  it("should store and retrieve data", async () => {
    const testData = "encrypted_data_here";

    const tx = await storage.saveData(testData);
    await tx.wait();

    const result = await storage.getData();
    expect(result).to.equal(testData);
  });

  it("should update data", async () => {
    await storage.saveData("old_data");
    const tx = await storage.updateData("new_data");
    await tx.wait();

    const result = await storage.getData();
    expect(result).to.equal("new_data");
  });

  it("should fail if data is empty", async () => {
    await expect(storage.saveData("")).to.be.revertedWith("Data cannot be empty");
  });
});
