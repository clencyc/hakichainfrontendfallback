# HakiChain Deployment Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MetaMask** browser extension
3. **Lisk Testnet LSK** for deployment fees
4. **Supabase** account for database

## Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Fill in your environment variables:
```env
# Blockchain Configuration
PRIVATE_KEY=your_64_character_private_key_without_0x
BLOCKCHAIN_PRIVATE_KEY=your_64_character_private_key_without_0x
RPC_URL=https://rpc.sepolia-api.lisk.com
NETWORK=liskTestnet

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Keys
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Smart Contract Deployment

1. **Install dependencies:**
```bash
npm install
```

2. **Validate environment:**
```bash
npm run validate
```

3. **Compile contracts:**
```bash
npm run compile
```

4. **Deploy contracts:**
```bash
npm run deploy
```

5. **Verify contracts:**
```bash
npm run verify
```

6. **Complete deployment:**
```bash
npm run deploy:full
```

After deployment, contract addresses will be saved in:
- `deployment-addresses.json`
- `.env.contracts`

Copy the contract addresses from `.env.contracts` to your main `.env` file.

## Frontend Deployment

1. **Build the frontend:**
```bash
npm run build
```

2. **Preview the build:**
```bash
npm run preview
```

3. **Deploy to Netlify/Vercel:**
   - Connect your GitHub repository
   - Set environment variables in the hosting platform
   - Deploy the `dist` folder

## Database Setup (Supabase)

1. Create a new Supabase project
2. Run the SQL migrations from `/supabase/migrations`
3. Set up Row Level Security (RLS) policies
4. Configure authentication providers

## Post-Deployment Verification

1. **Test wallet connection** on the deployed site
2. **Create a test bounty** to verify smart contract integration
3. **Test document upload** and verification
4. **Verify milestone completion** flow

## Troubleshooting

### Common Issues:

1. **"Insufficient funds" error:**
   - Ensure your wallet has enough LSK for gas fees
   - Check if you're on the correct network

2. **Contract verification failed:**
   - Verify your Etherscan API key
   - Check if the block explorer is responding

3. **Frontend environment variables:**
   - Ensure all `VITE_` prefixed variables are set
   - Rebuild after changing environment variables

4. **Network connectivity:**
   - Verify RPC URL is accessible
   - Check if MetaMask is connected to the correct network

## Security Checklist

- [ ] Private keys are not committed to version control
- [ ] Environment variables are properly set in production
- [ ] Smart contracts are verified on block explorer
- [ ] Test all critical functions before mainnet deployment
- [ ] Set up monitoring for contract events
- [ ] Configure proper access controls

## Mainnet Deployment

For mainnet deployment:

1. Update network configuration in `.env`:
```env
NETWORK=liskMainnet
RPC_URL=https://rpc.api.lisk.com
VITE_CHAIN_ID=1135
```

2. Use mainnet deployment script:
```bash
npm run deploy:mainnet
npm run verify:mainnet
```

3. Update frontend environment variables for mainnet contract addresses

## Support

For deployment issues, please:
1. Check the troubleshooting section above
2. Verify all prerequisites are met
3. Contact the development team with error logs
