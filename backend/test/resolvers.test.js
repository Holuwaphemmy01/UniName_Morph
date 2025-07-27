require("dotenv").config();
const { expect } = require("chai");
const sinon = require("sinon");
const { ethers } = require("ethers");
const { JsonRpcProvider, Wallet } = ethers;
const { createHash } = require("crypto");
const UniUser = require("../src/models/UniUser.js");
const resolvers = require("../src/schema/resolvers.js");
const StorageContract = require("../src/contract-interfaces/StorageContract.json");
const { createMockProvider, createMockContract } = require("./Helper.js");

describe("Resolvers.js Unit Tests", () => {
  let provider, wallet, mockContract, sandbox;
  let usersArray;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    provider = createMockProvider();
    wallet = new Wallet(process.env.PRIVATE_KEY, provider);
    mockContract = createMockContract(StorageContract.abi, wallet);
    resolvers.setStorageContract(mockContract);
    usersArray = [];
    resolvers.setUsersArray(usersArray);
    process.env.ENCRYPTION_KEY = Buffer.from("a".repeat(64), "hex");
    process.env.ENCRYPTION_IV = Buffer.from("b".repeat(16), "hex");
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should retrieve hash from StorageContract via getUserListHash", async () => {
    const expectedHash = "0x1234567890abcdef";
    sandbox.stub(mockContract, "getData").resolves(expectedHash);
    const result = await resolvers.Query.getUserListHash();
    expect(result).to.equal(expectedHash);
    expect(mockContract.getData.calledOnce).to.be.true;
  });

  it("should return null if no hash exists in getUserListHash", async () => {
    sandbox.stub(mockContract, "getData").resolves("");
    const result = await resolvers.Query.getUserListHash();
    expect(result).to.equal("");
  });

  it("should retrieve user by username via getUser", async () => {
    const user = new UniUser();
    user.setUsername("user1");
    user.setMorphAddress("0x1234567890123456789012345678901234567890");
    user.setListOfAddress("ethereum", "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd");
    usersArray.push(user);
    const result = await resolvers.Query.getUser(null, { username: "user1" });
    expect(result).to.deep.equal({
      username: "user1",
      morphAddress: "0x1234567890123456789012345678901234567890",
      listOfAddress: [{ chainName: "ethereum", address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" }]
    });
  });

  it("should throw error if user not found in getUser", async () => {
    try {
      await resolvers.Query.getUser(null, { username: "nonexistent" });
      expect.fail("Expected getUser to throw an error");
    } catch (error) {
      expect(error.message).to.equal("User not found");
    }
  });

  it("should save UniUser array and store hash via saveUserArray", async () => {
    const input = [
      {
        username: "user1",
        morphAddress: "0x1234567890123456789012345678901234567890",
        listOfAddress: [{ chainName: "ethereum", address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" }]
      }
    ];
    sandbox.stub(mockContract, "saveData").resolves({ wait: async () => ({}) });
    const result = await resolvers.Mutation.saveUserArray(null, { users: input });
    expect(result).to.be.a("string").length(64);
    expect(usersArray).to.have.length(1);
    expect(mockContract.saveData.calledOnce).to.be.true;
  });

  it("should reject saveUserArray with empty users array", async () => {
    try {
      await resolvers.Mutation.saveUserArray(null, { users: [] });
      expect.fail("Expected saveUserArray to throw an error");
    } catch (error) {
      expect(error.message).to.equal("Users array cannot be empty");
    }
  });

  it("should reject saveUserArray with missing username", async () => {
    const input = [
      {
        username: "",
        morphAddress: "0x1234567890123456789012345678901234567890",
        listOfAddress: []
      }
    ];
    try {
      await resolvers.Mutation.saveUserArray(null, { users: input });
      expect.fail("Expected saveUserArray to throw an error");
    } catch (error) {
      expect(error.message).to.equal("Username is required");
    }
  });

  it("should reject saveUserArray with invalid morphAddress", async () => {
    const input = [
      {
        username: "user1",
        morphAddress: "invalid",
        listOfAddress: []
      }
    ];
    try {
      await resolvers.Mutation.saveUserArray(null, { users: input });
      expect.fail("Expected saveUserArray to throw an error");
    } catch (error) {
      expect(error.message).to.equal("Invalid Morph address");
    }
  });

  it("should reject saveUserArray with invalid chain address", async () => {
    const input = [
      {
        username: "user1",
        morphAddress: "0x1234567890123456789012345678901234567890",
        listOfAddress: [{ chainName: "ethereum", address: "invalid" }]
      }
    ];
    try {
      await resolvers.Mutation.saveUserArray(null, { users: input });
      expect.fail("Expected saveUserArray to throw an error");
    } catch (error) {
      expect(error.message).to.equal("Invalid chain address");
    }
  });

  it("should update UniUser array and store hash via updateUserArray", async () => {
    const input = [
      {
        username: "user2",
        morphAddress: "0x2234567890123456789012345678901234567890",
        listOfAddress: [{ chainName: "bsc", address: "0xbbcdefabcdefabcdefabcdefabcdefabcdefabcd" }]
      }
    ];
    sandbox.stub(mockContract, "updateData").resolves({ wait: async () => ({}) });
    const result = await resolvers.Mutation.updateUserArray(null, { users: input });
    expect(result).to.be.a("string").length(64);
    expect(usersArray).to.have.length(1);
    expect(mockContract.updateData.calledOnce).to.be.true;
  });

  it("should reject updateUserArray with empty users array", async () => {
    try {
      await resolvers.Mutation.updateUserArray(null, { users: [] });
      expect.fail("Expected updateUserArray to throw an error");
    } catch (error) {
      expect(error.message).to.equal("Users array cannot be empty");
    }
  });

  it("should reject updateUserArray with missing username", async () => {
    const input = [
      {
        username: "",
        morphAddress: "0x1234567890123456789012345678901234567890",
        listOfAddress: []
      }
    ];
    try {
      await resolvers.Mutation.updateUserArray(null, { users: input });
      expect.fail("Expected updateUserArray to throw an error");
    } catch (error) {
      expect(error.message).to.equal("Username is required");
    }
  });

  it("should add single user via addUser", async () => {
    const input = {
      username: "user1",
      morphAddress: "0x1234567890123456789012345678901234567890",
      listOfAddress: [{ chainName: "ethereum", address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" }]
    };
    sandbox.stub(mockContract, "saveData").resolves({ wait: async () => ({}) });
    const result = await resolvers.Mutation.addUser(null, input);
    expect(result).to.deep.equal({
      username: "user1",
      morphAddress: "0x1234567890123456789012345678901234567890",
      listOfAddress: [{ chainName: "ethereum", address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" }]
    });
    expect(usersArray).to.have.length(1);
    expect(mockContract.saveData.calledOnce).to.be.true;
  });

  it("should reject addUser with invalid morphAddress", async () => {
    const input = {
      username: "user1",
      morphAddress: "invalid",
      listOfAddress: []
    };
    try {
      await resolvers.Mutation.addUser(null, input);
      expect.fail("Expected addUser to throw an error");
    } catch (error) {
      expect(error.message).to.equal("Invalid Morph address");
    }
  });

  it("should reject addUser with missing username", async () => {
    const input = {
      username: "",
      morphAddress: "0x1234567890123456789012345678901234567890",
      listOfAddress: []
    };
    try {
      await resolvers.Mutation.addUser(null, input);
      expect.fail("Expected addUser to throw an error");
    } catch (error) {
      expect(error.message).to.equal("Username is required");
    }
  });

  it("should reject addUser with invalid chain address", async () => {
    const input = {
      username: "user1",
      morphAddress: "0x1234567890123456789012345678901234567890",
      listOfAddress: [{ chainName: "ethereum", address: "invalid" }]
    };
    try {
      await resolvers.Mutation.addUser(null, input);
      expect.fail("Expected addUser to throw an error");
    } catch (error) {
      expect(error.message).to.equal("Invalid chain address");
    }
  });

  it("should handle large UniUser array in saveUserArray", async () => {
    const input = Array(100).fill().map((_, i) => ({
      username: `user${i}`,
      morphAddress: "0x1234567890123456789012345678901234567890",
      listOfAddress: [{ chainName: "ethereum", address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" }]
    }));
    sandbox.stub(mockContract, "saveData").resolves({ wait: async () => ({}) });
    const result = await resolvers.Mutation.saveUserArray(null, { users: input });
    expect(result).to.be.a("string").length(64);
    expect(usersArray).to.have.length(100);
    expect(mockContract.saveData.calledOnce).to.be.true;
  });
});