import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  // Generate a new random wallet
  const wallet = ethers.Wallet.createRandom();
  
  console.log('\n🔑 Generated new wallet:');
  console.log('------------------------');
  console.log('Address:', wallet.address);
  console.log('Private Key:', wallet.privateKey);
  console.log('------------------------\n');

  // Create or update .env file
  const envPath = path.join(__dirname, '../.env');
  let envContent = '';

  if (fs.existsSync(envPath)) {
    const existingContent = fs.readFileSync(envPath, 'utf8');
    // Replace existing PRIVATE_KEY or add new one
    if (existingContent.includes('PRIVATE_KEY=')) {
      envContent = existingContent.replace(
        /PRIVATE_KEY=.*/,
        `PRIVATE_KEY=${wallet.privateKey}`
      );
    } else {
      envContent = existingContent + `\nPRIVATE_KEY=${wallet.privateKey}`;
    }
  } else {
    envContent = `PRIVATE_KEY=${wallet.privateKey}`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Private key has been saved to .env file');

  console.log('\n⚠️  Important:');
  console.log('1. Save this private key securely');
  console.log('2. Never share it with anyone');
  console.log('3. Keep a backup in a safe place');
  console.log('4. Make sure .env is in your .gitignore\n');
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
}); 