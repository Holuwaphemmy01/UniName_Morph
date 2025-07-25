const hre = require("hardhat");

async function main() {
  console.log("Testing Morph Holesky connection...");
  
  // Get provider
  const provider = hre.ethers.provider;
  
  // Check network
  const network = await provider.getNetwork();
  console.log("Connected to network:", network.name, "Chain ID:", network.chainId);
  
  // Get accounts
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  
  // Check balance
  const balance = await provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");
  
  // Get latest block
  const blockNumber = await provider.getBlockNumber();
  console.log("Latest block:", blockNumber);
  
  console.log("✅ Connection successful!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Connection failed:", error);
    process.exit(1);
  });