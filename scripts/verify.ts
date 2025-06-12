import { run } from "hardhat";

async function main() {
  console.log("Starting contract verification...");

  const contracts = {
    HakiToken: {
      address: process.env.HAKI_TOKEN_ADDRESS,
      constructorArgs: []
    },
    DocumentRegistry: {
      address: process.env.DOCUMENT_REGISTRY_ADDRESS,
      constructorArgs: []
    },
    ReputationSystem: {
      address: process.env.REPUTATION_SYSTEM_ADDRESS,
      constructorArgs: []
    },
    MilestoneEscrow: {
      address: process.env.MILESTONE_ESCROW_ADDRESS,
      constructorArgs: [
        process.env.HAKI_TOKEN_ADDRESS,
        process.env.REPUTATION_SYSTEM_ADDRESS
      ]
    },
    LegalBounty: {
      address: process.env.LEGAL_BOUNTY_ADDRESS,
      constructorArgs: [
        process.env.HAKI_TOKEN_ADDRESS,
        process.env.DOCUMENT_REGISTRY_ADDRESS,
        process.env.MILESTONE_ESCROW_ADDRESS,
        process.env.REPUTATION_SYSTEM_ADDRESS
      ]
    }
  };

  for (const [name, contract] of Object.entries(contracts)) {
    if (!contract.address) {
      console.log(`Skipping ${name} - address not found in environment`);
      continue;
    }

    try {
      console.log(`\nVerifying ${name}...`);
      await run("verify:verify", {
        address: contract.address,
        constructorArguments: contract.constructorArgs,
      });
      console.log(`${name} verified successfully`);
    } catch (error) {
      console.error(`Error verifying ${name}:`, error);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 