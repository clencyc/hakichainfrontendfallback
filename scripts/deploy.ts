import { ethers } from "hardhat";

async function main() {
  // Deploy HakiToken
  const HakiToken = await ethers.getContractFactory("HakiToken");
  const hakiToken = await HakiToken.deploy();
  await hakiToken.waitForDeployment();
  console.log("HakiToken deployed to:", await hakiToken.getAddress());

  // Deploy LegalBounty
  const LegalBounty = await ethers.getContractFactory("LegalBounty");
  const legalBounty = await LegalBounty.deploy(await hakiToken.getAddress());
  await legalBounty.waitForDeployment();
  console.log("LegalBounty deployed to:", await legalBounty.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});