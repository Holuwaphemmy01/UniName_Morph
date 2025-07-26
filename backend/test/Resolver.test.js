const { expect } = require("chai");
const sinon = require("sinon");
const { ethers } = require("ethersproject/ethers"); // Use require for compatibility
const { createHash } = require("crypto");
const UniUser = require("../model/UniUser");
const resolvers = require("../schema/resolvers.js");
const { JsonRpcProvider, Wallet, Contract } = require("@ethersproject/providers");
const { createMockProvider, createMockContract } = require("./helpers.js");

describe("Resolvers.js Unit Tests", () => {
  let provider, wallet, mockContract, sandbox;
  let usersArray;

  beforeEach((() => {
    sandbox = sinon.createSandbox();
    provider = createMockProvider();
    wallet = new Wallet("0xPRIVATE_KEY", provider);
    mockContract = createMockContract(StorageContract.abi, wallet);
    // Override storageContract in resolvers
    resolvers.setStorageContract(mockContract);
    // Reset users array
    usersArray = [];
    resolvers.setUsersArray(usersArray);
    // Set environment variables
    process.env.ENCRYPTION_KEY = Buffer.from("a".repeat(64), "hex"); // 32 bytes
    process.env.ENCRYPTION_IV = Buffer.from("b".repeat(16), "hex"); // 16 bytes
  }));

  afterEach((() => {
    sandbox.restore();
    }));

  it("should retrieve hash from StorageContract via getUserListHash", async () => {
    const expectedHash = "0x1234567890abcdef";
    sandbox.stub(mockContract, "getData").returns(Promise.resolve(expectedHash));
    const result = await resolvers.Query.getUserListHash();
    expect(result).to.equal(expectedHash);
    expect(mockContract.getData).to.have.been.calledOnce();
  });

  it("should return null if no hash exists in getUserListHash", async () => {
    sandbox.stub(mockContract.getData).returns(Promise.resolve(""));
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
    await expect(resolvers.Query.getUser(null, { username: "nonexistent" })).to.be.rejectedWith("User not found");
  });

  it("should save UniUser array and store hash via saveUserArray", async () => {
    const input = [
      {
        username: "user1",
        morphAddress: "0x1234567890123456789012345678901234567890",
        listOfAddress: [{ chainName: "ethereum", address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" }]
      }
    ];
    sandbox.stub(mockContract, "saveData").returns(Promise.resolve({ wait: () => Promise.resolve() }));
    const result = await resolvers.Mutation.saveUserArray(null, { users: input });
    expect(result).to.be.a("string").length(64); // SHA-256 hash
    expect(usersArray).to.have.length(1);
    expect(mockContract.saveData).to.have.been.calledOnce();
  });

  it("should reject saveUserArray with empty users array", async () => {
    await expect(resolvers.Mutation.saveUserArray(null, { users: [] })).to.be.rejectedWith("Users array cannot be empty");
  });

  it("should reject saveUserArray with missing username", async () => {
    const input = [{ username: "", morphAddress: "0x1234...", listOfAddress: [] }];
    await expect(resolvers.Mutation.saveUserArray(null, { users: input })).to.be.rejectedWith("Username is required");
  });

  it("should reject saveUserArray with invalid morphAddress", async () => {
    const input = [{ username: "user1", morphAddress: "invalid", listOfAddress: [] }];
    await expect(resolvers.Mutation.saveUserArray(null, { users: input })).to.be.rejectedWith("Invalid Morph address");
  });

  it("should reject saveUserArray with invalid chain address", async () => {
    const input = [
      {
        username: "user1",
        morphAddress: "0x1234567890123456789012345678901234567890",
        listOfAddress: [{ chainName: "ethereum", address: "invalid" }]
      }
    ];
    await expect(resolvers.Mutation.saveUserArray(null, { users: input })).to.be.rejectedWith("Invalid chain address");
  });

  it("should update UniUser array and store hash via updateUserArray", async () => {
    const input = [
      {
        username: "user2",
        morphAddress: "0x2234567890123456789012345678901234567890",
        listOfAddress: [{ chainName: "bsc", address: "0xbbcdefabcdefabcdefabcdefabcdefabcdefabcd" }]
      }
    ];
    sandbox.stub(mockContract, "updateData").returns(Promise.resolve({ wait: () => Promise.resolve() }));
    const result = await resolvers.Mutation.updateUserArray(null, { users: input });
    expect(result).to.be.a("string").length(64);
    expect(usersArray).to.have.length(1);
    expect(mockContract.updateData).to.have.been.calledOnce();
  });

  it("should reject updateUserArray with empty users array", async () => {
    await expect(resolvers.Mutation.updateUserArray(null, { users: [] })).to.be.rejectedWith("Users array cannot be empty");
  });

  it("should reject updateUserArray with missing username", async () => {
    const input = [{ username: "", morphAddress: "0x1234...", listOfAddress: [] }];
    await expect(resolvers.Mutation.updateUserArray(null, { users: input })).to.be.rejectedWith("Username is required");
  });

  it("should add single user via addUser", async () => {
    const input = {
      username: "user1",
      morphAddress: "0x1234567890123456789012345678901234567890",
      listOfAddress: [{ chainName: "ethereum", address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" }]
    };
    const result = await resolvers.Mutation.addUser(null, input);
    expect(result).to.deep.equal(input);
    expect(usersArray).to.have.length(1);
  });

  it("should reject addUser with invalid morphAddress", async () => {
    const input = {
      username: "user1",
      morphAddress: "invalid",
      listOfAddress: []
    };
    await expect(resolvers.Mutation.addUser(null, input)).to.be.rejectedWith("Invalid Morph address");
  });

  it("should reject addUser with missing username", async () => {
    const input = {
      username: "",
      morphAddress: "0x1234567890123456789012345678901234567890",
      listOfAddress: []
    };
    await expect(resolvers.Mutation.addUser(null, input)).to.be.rejectedWith("Username is required");
  });

  it("should reject addUser with invalid chain address", async () => {
    const input = {
      username: "user1",
      morphAddress: "0x1234567890123456789012345678901234567890",
      listOfAddress: [{ chainName: "ethereum", address: "invalid" }]
    };
    await expect(resolvers.Mutation.addUser(null, input)).to.be.rejectedWith("Invalid chain address");
  });

  it("should handle large UniUser array in saveUserArray", async () => {
    const input = Array(100).fill().map((_, i) => ({
      username: `user${i}`,
      morphAddress: `0x${"1234".repeat(10)}`,
      listOfAddress: [{ chainName: "ethereum", address: `0x${"abcd".repeat(10)}` }]
    }));
    sandbox.stub(mockContract, "saveData").returns(Promise.resolve({ wait: () => Promise.resolve() }));
    const result = await resolvers.Mutation.saveUserArray(null, { users: input });
    expect(result).to.be.a("string").length(64);
    expect(usersArray).to.have.length(100);
  });
});