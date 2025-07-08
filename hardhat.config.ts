import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

// Validate private key
const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
if (!privateKey) {
  throw new Error("Please set your PRIVATE_KEY in the .env file");
}

// Format private key (add 0x prefix if missing)
const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;

// if (!privateKey.startsWith('0x')) {
//   throw new Error("Private key must start with '0x'");
// }

// if (privateKey.length !== 66) { // 0x + 64 characters
//   throw new Error("Private key must be 64 characters long (excluding 0x prefix)");
// }

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    liskTestnet: {
      url: "https://rpc.sepolia-api.lisk.com",
      chainId: 4202,
      accounts: [formattedPrivateKey],
      gasPrice: 1000000000, // 1 gwei
    },
    liskMainnet: {
      url: "https://lisk.drpc.org",
      chainId: 1135,
      accounts: [formattedPrivateKey],
      gasPrice: 1000000000, // 1 gwei
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};

export default config;