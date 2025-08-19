const hre = require("hardhat");

async function main() {
  console.log("Deploying StorageContract to Morph Holesky...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  const StorageContract = await hre.ethers.getContractFactory("StorageContract");
  const storage = await StorageContract.deploy();

  await storage.waitForDeployment();
  const contractAddress = await storage.getAddress();

  console.log("StorageContract deployed to:", contractAddress);
  console.log("View on explorer:", `https://explorer-holesky.morphl2.io/address/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
