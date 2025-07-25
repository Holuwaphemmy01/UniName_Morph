const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PaymentContract", function () {
  let PaymentContract, paymentContract, user1, user2, admin;
  const AMOUNT = ethers.parseEther("1");

  beforeEach(async function () {
    [user1, user2, admin] = await ethers.getSigners();
    PaymentContract = await ethers.getContractFactory("PaymentContract");
    paymentContract = await PaymentContract.deploy();
    await paymentContract.waitForDeployment();
  });

  it("should allow user to send payment to specified admin address", async function () {
    const initialAdminBalance = await ethers.provider.getBalance(admin.address);
    await expect(
      paymentContract.connect(user1).sendPayment(AMOUNT, admin.address, { value: AMOUNT })
    )
      .to.emit(paymentContract, "PaymentSent")
      .withArgs(user1.address, admin.address, AMOUNT);

    const finalAdminBalance = await ethers.provider.getBalance(admin.address);
    expect(finalAdminBalance).to.be.gt(initialAdminBalance);
  });

  it("should revert if payment amount is zero", async function () {
    await expect(
      paymentContract.connect(user1).sendPayment(0, admin.address, { value: 0 })
    ).to.be.revertedWith("Amount must be greater than zero");
  });

  it("should revert if sent value does not match specified amount", async function () {
    await expect(
      paymentContract.connect(user1).sendPayment(AMOUNT, admin.address, { value: ethers.parseEther("0.5") })
    ).to.be.revertedWith("Sent value must match specified amount");
  });

  it("should revert if admin address is zero", async function () {
    await expect(
      paymentContract.connect(user1).sendPayment(AMOUNT, ethers.ZeroAddress, { value: AMOUNT })
    ).to.be.revertedWith("Admin address cannot be zero");
  });

  it("should allow payment to different admin addresses", async function () {
    const initialUser2Balance = await ethers.provider.getBalance(user2.address);
    await expect(
      paymentContract.connect(user1).sendPayment(AMOUNT, user2.address, { value: AMOUNT })
    )
      .to.emit(paymentContract, "PaymentSent")
      .withArgs(user1.address, user2.address, AMOUNT);

    const finalUser2Balance = await ethers.provider.getBalance(user2.address);
    expect(finalUser2Balance).to.be.gt(initialUser2Balance);
  });


//     await expect(
//       paymentContract.connect(user1).sendPayment(AMOUNT, revertingContract.target, { value: AMOUNT })
//     ).to.be.revertedWith("Payment transfer failed");
//   });

  it("should revert on direct ETH deposits", async function () {
    await expect(
      user1.sendTransaction({ to: paymentContract.target, value: AMOUNT })
    ).to.be.revertedWith("Direct ETH deposits not allowed");
  });
});