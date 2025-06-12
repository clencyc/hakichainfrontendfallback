import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

function validatePrivateKey(privateKey: string): boolean {
  // Remove 0x prefix if it exists
  const cleanKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;

  // Check if private key is 64 characters long
  if (cleanKey.length !== 64) {
    console.error('❌ Private key must be 64 characters long');
    return false;
  }

  // Check if private key is valid hex
  if (!/^[0-9a-fA-F]{64}$/.test(cleanKey)) {
    console.error('❌ Private key must be a valid hexadecimal string');
    return false;
  }

  return true;
}

async function validateNetworkConnection(rpcUrl: string): Promise<boolean> {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    await provider.getNetwork();
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to network:', error);
    return false;
  }
}

async function validateWalletBalance(privateKey: string, rpcUrl: string): Promise<boolean> {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const balance = await provider.getBalance(await wallet.getAddress());
    
    // Check if balance is sufficient (e.g., at least 0.1 LSK)
    const minBalance = ethers.parseEther('0.1');
    if (balance < minBalance) {
      console.error('❌ Insufficient balance. Need at least 0.1 LSK for deployment');
      return false;
    }
    
    console.log('✅ Wallet balance:', ethers.formatEther(balance), 'LSK');
    return true;
  } catch (error) {
    console.error('❌ Failed to check wallet balance:', error);
    return false;
  }
}

async function main() {
  console.log('🔍 Validating environment setup...\n');

  // Check if .env file exists
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found');
    process.exit(1);
  }
  console.log('✅ .env file found');

  // Validate private key
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error('❌ PRIVATE_KEY not found in .env file');
    process.exit(1);
  }
  if (!validatePrivateKey(privateKey)) {
    process.exit(1);
  }
  console.log('✅ Private key format is valid');

  // Validate network connection
  const rpcUrl = 'https://rpc.sepolia-api.lisk.com';
  if (!await validateNetworkConnection(rpcUrl)) {
    process.exit(1);
  }
  console.log('✅ Network connection successful');

  // Validate wallet balance
  if (!await validateWalletBalance(privateKey, rpcUrl)) {
    process.exit(1);
  }

  console.log('\n✅ Environment validation completed successfully!');
}

main().catch((error) => {
  console.error('❌ Validation failed:', error);
  process.exit(1);
}); 