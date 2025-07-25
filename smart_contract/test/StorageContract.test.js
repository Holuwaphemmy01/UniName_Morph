const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StorageContract", function () {
  let StorageContract, storageContract, user1, user2;

  beforeEach(async function () {
    [user1, user2] = await ethers.getSigners();
    StorageContract = await ethers.getContractFactory("StorageContract");
    storageContract = await StorageContract.deploy();
    await storageContract.waitForDeployment();
  });

  it("should save and retrieve data for the caller's address", async function () {
    const testData = "Hello, World!";
    await expect(storageContract.connect(user1).saveData(testData))
      .to.emit(storageContract, "DataSaved")
      .withArgs(user1.address, testData);
    expect(await storageContract.connect(user1).getData()).to.equal(testData);
  });

  it("should update existing data for the caller's address", async function () {
    const initialData = "Initial Data";
    const updatedData = "Updated Data";
    await storageContract.connect(user1).saveData(initialData);
    await expect(storageContract.connect(user1).updateData(updatedData))
      .to.emit(storageContract, "DataUpdated")
      .withArgs(user1.address, updatedData);
    expect(await storageContract.connect(user1).getData()).to.equal(updatedData);
  });

  it("should revert if updating with empty data", async function () {
    await storageContract.connect(user1).saveData("Some Data");
    await expect(storageContract.connect(user1).updateData("")).to.be.revertedWith("New data cannot be empty");
  });

  it("should revert if updating data that does not exist", async function () {
    await expect(storageContract.connect(user1).updateData("Some Data")).to.be.revertedWith("No data exists to update");
  });

  it("should allow different users to save and update their own data", async function () {
    const user1Data = "User1 Data";
    const user1UpdatedData = "User1 Updated";
    const user2Data = "User2 Data";
    await storageContract.connect(user1).saveData(user1Data);
    await storageContract.connect(user2).saveData(user2Data);
    await storageContract.connect(user1).updateData(user1UpdatedData);
    expect(await storageContract.connect(user1).getData()).to.equal(user1UpdatedData);
    expect(await storageContract.connect(user2).getData()).to.equal(user2Data);
  });

  it("should retrieve empty string if no data is saved", async function () {
    expect(await storageContract.connect(user1).getData()).to.equal("");
  });

  it("should emit DataUpdated event with correct parameters", async function () {
    const testData = "Test Data";
    const updatedData = "Updated Test Data";
    await storageContract.connect(user2).saveData(testData);
    await expect(storageContract.connect(user2).updateData(updatedData))
      .to.emit(storageContract, "DataUpdated")
      .withArgs(user2.address, updatedData);
  });

  it("should handle long string data in update", async function () {
    const initialData = "Short Data";
    const longData = "a".repeat(1000); 
    await storageContract.connect(user1).saveData(initialData);
    await storageContract.connect(user1).updateData(longData);
    expect(await storageContract.connect(user1).getData()).to.equal(longData);
  });
});