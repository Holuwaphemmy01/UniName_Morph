import { expect } from "chai";
import {ethers} from "hardhat";

describe("Register", function () {
  let register: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Register = await ethers.getContractFactory("Register");
    register = await Register.deploy();
    await register.deployed();
  });

  it("should register a user with a valid username", async function () {
    await register.connect(addr1).register("alice");
    expect(await register.getUser(addr1.address)).to.equal("alice");
  });

  it("should not allow registration with an empty username", async function () {
    await expect(register.connect(addr1).register("")).to.be.revertedWith("Invalid username");
  });

  it("should not allow a user to register twice", async function () {
    await register.connect(addr1).register("alice");
    await expect(register.connect(addr1).register("bob")).to.be.revertedWith("User already registered");
  });

  it("should return the correct username for a registered user", async function () {
    await register.connect(addr2).register("bob");
    expect(await register.getUser(addr2.address)).to.equal("bob");
  });

  it("should revert when getting a user that is not registered", async function () {
    await expect(register.getUser(addr1.address)).to.be.revertedWith("User not found");
  });
});
