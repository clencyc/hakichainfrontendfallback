import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ESignatureRegistry contract...");

  // Get the contract factory
  const ESignatureRegistry = await ethers.getContractFactory("ESignatureRegistry");
  
  // Deploy the contract
  const eSignatureRegistry = await ESignatureRegistry.deploy();
  
  // Wait for deployment to complete
  await eSignatureRegistry.waitForDeployment();
  
  // Get the deployed address
  const address = await eSignatureRegistry.getAddress();
  
  console.log("ESignatureRegistry deployed to:", address);
  
  // Verify the deployment
  console.log("Verifying deployment...");
  const deployedContract = await ethers.getContractAt("ESignatureRegistry", address);
  const owner = await deployedContract.owner();
  console.log("Contract owner:", owner);
  
  console.log("Deployment completed successfully!");
  
  return {
    contract: eSignatureRegistry,
    address: address
  };
}

// Handle errors
main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
}); 