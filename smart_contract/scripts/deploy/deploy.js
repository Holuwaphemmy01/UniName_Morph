// const hre = require("hardhat");

// async function main() {
//   console.log("Deploying UniNameRegistry to Morph Holesky...");
  
//   // Get deployer
//   const [deployer] = await hre.ethers.getSigners();
//   console.log("Deploying with account:", deployer.address);
  
//   // Check balance
//   const balance = await hre.ethers.provider.getBalance(deployer.address);
//   console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  
//   // Deploy contract
//   const UniNameRegistry = await hre.ethers.getContractFactory("UniNameRegistry");
//   const uninameRegistry = await UniNameRegistry.deploy();
  
//   await uninameRegistry.waitForDeployment();
//   const contractAddress = await uninameRegistry.getAddress();
  
//   console.log("✅ UniNameRegistry deployed to:", contractAddress);
//   console.log("🔗 View on explorer:", `https://explorer-holesky.morphl2.io/address/${contractAddress}`);
  
//   // Save deployment info
//   const deploymentInfo = {
//     network: "morphHolesky",
//     address: contractAddress,
//     deployer: deployer.address,
//     timestamp: new Date().toISOString(),
//     blockNumber: await hre.ethers.provider.getBlockNumber()
//   };
  
//   console.log("📝 Deployment info:", deploymentInfo);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error("❌ Deployment failed:", error);
//     process.exit(1);
//   });




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

  console.log("✅ StorageContract deployed to:", contractAddress);
  console.log("🔗 View on explorer:", `https://explorer-holesky.morphl2.io/address/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
