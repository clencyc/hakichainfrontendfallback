import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

async function main() {
  console.log("🚀 Starting deployment...");

  // Get the private key and format it
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("Please set your PRIVATE_KEY in the .env file");
  }
  const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;

  // Get the network
  const network = process.env.NETWORK || "liskTestnet";
  console.log(`🌐 Deploying to ${network}...`);

  // Get the provider and signer
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "https://rpc.sepolia-api.lisk.com");
  const signer = new ethers.Wallet(formattedPrivateKey, provider);

  // Deploy contracts
  console.log("📦 Deploying contracts...");

  // Deploy HakiToken contract
  console.log("Deploying HakiToken...");
  const hakiToken = await ethers.deployContract("HakiToken", [], signer);
  await hakiToken.waitForDeployment();
  console.log(`✅ HakiToken deployed to: ${await hakiToken.getAddress()}`);

  // Deploy LegalBounty contract
  console.log("Deploying LegalBounty...");
  const legalBounty = await ethers.deployContract("LegalBounty", [await hakiToken.getAddress()], signer);
  await legalBounty.waitForDeployment();
  console.log(`✅ LegalBounty deployed to: ${await legalBounty.getAddress()}`);

  // Deploy DocumentRegistry contract
  console.log("Deploying DocumentRegistry...");
  const documentRegistry = await ethers.deployContract("DocumentRegistry", [], signer);
  await documentRegistry.waitForDeployment();
  console.log(`✅ DocumentRegistry deployed to: ${await documentRegistry.getAddress()}`);

  // Deploy MilestoneEscrow contract
  console.log("Deploying MilestoneEscrow...");
  const milestoneEscrow = await ethers.deployContract("MilestoneEscrow", [await hakiToken.getAddress()], signer);
  await milestoneEscrow.waitForDeployment();
  console.log(`✅ MilestoneEscrow deployed to: ${await milestoneEscrow.getAddress()}`);

  // Deploy ReputationSystem contract
  console.log("Deploying ReputationSystem...");
  const reputationSystem = await ethers.deployContract("ReputationSystem", [], signer);
  await reputationSystem.waitForDeployment();
  console.log(`✅ ReputationSystem deployed to: ${await reputationSystem.getAddress()}`);

  // Save deployment addresses
  const addresses = {
    hakiToken: await hakiToken.getAddress(),
    legalBounty: await legalBounty.getAddress(),
    documentRegistry: await documentRegistry.getAddress(),
    milestoneEscrow: await milestoneEscrow.getAddress(),
    reputationSystem: await reputationSystem.getAddress(),
    network,
    timestamp: new Date().toISOString()
  };

  const addressesPath = path.join(__dirname, "../deployment-addresses.json");
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log(`📝 Deployment addresses saved to: ${addressesPath}`);

  console.log("🎉 Deployment completed successfully!");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});