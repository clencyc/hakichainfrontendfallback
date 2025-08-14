# HakiChain v2

Justice Made Accessible Through Blockchain and AI

---

## Overview

HakiChain is a blockchain-based platform connecting NGOs, lawyers, and donors to facilitate legal aid through bounties and smart contracts. The platform aims to make legal justice more accessible, transparent, and efficient for underserved communities.

---

## Architecture

### 1. Frontend (React + Vite)

- **Framework:** React (with TypeScript)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router
- **State/Context:** React Context API
- **API/Blockchain:** Interacts with smart contracts and Supabase

### 2. Backend

- **Supabase:**
  - Auth (users, roles)
  - Database (Postgres)
  - Storage (documents)
  - Realtime (optional)
- **Smart Contracts:**
  - Written in Solidity
  - Deployed via Hardhat
  - Types generated with TypeChain

### 3. Smart Contracts

- **Contracts:**
  - `DocumentRegistry.sol`: Document verification and storage
  - `HakiToken.sol`: Platform token (if used)
  - `LegalBounty.sol`: Bounty management
  - `MilestoneEscrow.sol`: Milestone-based escrow
  - `ReputationSystem.sol`: User reputation
- **Deployment:**
  - Scripts in `/scripts`
  - Addresses tracked in `deployment-addresses.json`

### 4. Database (Supabase/Postgres)

- **Tables:** users, bounties, milestones, donations, documents
- **RLS:** Row Level Security enabled
- **Policies:** CRUD based on user roles

---

## Folder Structure

```
├── contracts/           # Solidity smart contracts
├── scripts/             # Deployment and utility scripts
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/           # Main app pages (Home, Blog, FAQ, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── contexts/        # React context providers
│   ├── lib/             # Utility libraries (contracts, supabase)
│   ├── services/        # Data fetching, mock data
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── ...
├── public/              # Static assets
├── supabase/            # DB migrations, SQL
├── typechain-types/     # TypeScript types for contracts
├── artifacts/           # Compiled contract artifacts
├── ...
```

---

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Supabase (Postgres, Auth, Storage)
- **Smart Contracts:** Solidity, Hardhat, TypeChain
- **Other:** Vite, ESLint, Netlify (deployment)

---

## Onboarding & Setup

### 1. Prerequisites

- Node.js (v18+ recommended)
- Yarn or npm
- [Supabase](https://supabase.com/) account (for local dev)
- [Hardhat](https://hardhat.org/) (for smart contract dev)

### 2. Install Dependencies

```sh
# Using npm
npm install
# Or using yarn
yarn install
```

### 3. Environment Variables

- Copy `.env.example` to `.env` and fill in Supabase and blockchain config.

### 4. Running the App

```sh
# Start frontend
yarn dev
# Or
npm run dev
```

### 5. Smart Contracts

```sh
# Compile contracts
yarn hardhat compile
# Run tests
yarn hardhat test
# Deploy (see scripts/deploy.ts)
```

### 6. Database

- Supabase migrations in `/supabase/migrations`
- Apply using Supabase CLI or dashboard

### 7. Linting & Formatting

```sh
yarn lint
```

---

## Key Features

- **Legal Bounties:** NGOs post cases, donors fund, lawyers apply and work
- **Milestone Escrow:** Funds released on verified milestone completion
- **Document Registry:** Secure, verifiable document uploads
- **Reputation System:** Track lawyer/NGO performance
- **Donations:** Transparent, blockchain-based
- **Notifications:** For donations, applications, milestone reviews
- **Role-based Dashboards:** NGO, Lawyer, Donor

---

## Documentation

- [Platform Documentation](src/pages/Documentation.tsx)
- [FAQ](src/pages/FAQ.tsx)
- [Terms of Service](src/pages/legal/TermsOfService.tsx)
- [Privacy Policy](src/pages/legal/PrivacyPolicy.tsx)

---

## Contribution Guidelines

- Fork and clone the repo
- Create a feature branch
- Follow code style (see ESLint config)
- Write clear commit messages
- Open a pull request with description

---

## Contact & Support

- For issues, open a GitHub issue or contact the project maintainer.
- For security or legal questions, see [Terms of Service](src/pages/legal/TermsOfService.tsx) and [Privacy Policy](src/pages/legal/PrivacyPolicy.tsx).

---

## License

[MIT](LICENSE)
