import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const addresses = {
    HAKI_TOKEN_ADDRESS: process.env.HAKI_TOKEN_ADDRESS,
    DOCUMENT_REGISTRY_ADDRESS: process.env.DOCUMENT_REGISTRY_ADDRESS,
    REPUTATION_SYSTEM_ADDRESS: process.env.REPUTATION_SYSTEM_ADDRESS,
    MILESTONE_ESCROW_ADDRESS: process.env.MILESTONE_ESCROW_ADDRESS,
    LEGAL_BOUNTY_ADDRESS: process.env.LEGAL_BOUNTY_ADDRESS
  };

  // Create .env file content
  const envContent = Object.entries(addresses)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n') + '\n';

  // Create .env.example file content (without actual addresses)
  const envExampleContent = Object.keys(addresses)
    .map(key => `${key}=`)
    .join('\n') + '\n';

  // Append to .env file
  fs.appendFileSync(path.join(__dirname, '../.env'), envContent);
  console.log('Appended contract addresses to .env file');

  // Append to .env.example file
  fs.appendFileSync(path.join(__dirname, '../.env.example'), envExampleContent);
  console.log('Appended to .env.example file');

  // Create frontend .env file content
  const frontendEnvContent = Object.entries(addresses)
    .map(([key, value]) => `VITE_${key}=${value}`)
    .join('\n') + '\n';

  // Append to .env.frontend file
  fs.appendFileSync(path.join(__dirname, '../.env.frontend'), frontendEnvContent);
  console.log('Appended to .env.frontend file for frontend configuration');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 