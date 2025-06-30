
# HakiChain Technical Documentation

## 1. High-Level Overview

HakiChain is a full-stack web3 application designed to connect NGOs, lawyers, and donors to facilitate legal aid. The platform is built on a modern tech stack, leveraging the power of blockchain for transparency and security.

### 1.1. Architecture

The application follows a standard client-server architecture with a frontend, backend, and a set of smart contracts on the blockchain.

*   **Frontend:** A React application built with Vite, TypeScript, and Tailwind CSS.
*   **Backend:** A combination of Hardhat for smart contract deployment and management, and Supabase for database and authentication.
*   **Smart Contracts:** Written in Solidity and deployed on an Ethereum-compatible blockchain.

### 1.2. Technologies Used

*   **Frontend:**
    *   React
    *   Vite
    *   TypeScript
    *   Tailwind CSS
    *   React Router
    *   TanStack Query
    *   Framer Motion
*   **Backend:**
    *   Hardhat
    *   Ethers.js
    *   Supabase
*   **Smart Contracts:**
    *   Solidity
    *   OpenZeppelin Contracts

## 2. Smart Contracts

The core logic of the HakiChain platform is encapsulated in a set of Solidity smart contracts.

### 2.1. `HakiToken.sol`

*   **Purpose:** An ERC20 token used for funding legal bounties and rewarding participants on the platform.
*   **Inherits:** `ERC20`, `Ownable`
*   **Key Functions:**
    *   `mint(address to, uint256 amount)`: Mints new tokens to a specified address. Only the owner can call this function.

### 2.2. `LegalBounty.sol`

*   **Purpose:** Manages the creation, funding, and lifecycle of legal bounties.
*   **Inherits:** `ReentrancyGuard`, `Ownable`
*   **Key Structs:**
    *   `Milestone`: Represents a single milestone within a bounty.
    *   `Bounty`: Represents a legal bounty.
*   **Key Functions:**
    *   `createBounty(...)`: Creates a new legal bounty.
    *   `fundBounty(uint256 _bountyId, uint256 _amount)`: Funds a bounty with HAKI tokens.
    *   `assignLawyer(uint256 _bountyId, address _lawyer)`: Assigns a lawyer to a bounty.
    *   `submitMilestoneProof(uint256 _bountyId, uint256 _milestoneIndex, bytes32 _proofHash)`: Submits proof of work for a milestone.
    *   `verifyMilestone(uint256 _bountyId, uint256 _milestoneIndex)`: Verifies a milestone and releases payment to the lawyer.
    *   `cancelBounty(uint256 _bountyId)`: Cancels a bounty.

### 2.3. `DocumentRegistry.sol`

*   **Purpose:** A registry for storing and verifying document hashes on the blockchain.
*   **Inherits:** `AccessControl`, `ReentrancyGuard`
*   **Key Structs:**
    *   `Document`: Represents a registered document.
*   **Key Functions:**
    *   `registerDocument(bytes32 _documentHash, uint256 _bountyId, uint256 _milestoneId)`: Registers a new document hash.
    *   `verifyDocument(bytes32 _documentHash)`: Verifies a registered document.

### 2.4. `MilestoneEscrow.sol`

*   **Purpose:** An escrow contract for holding and releasing milestone payments.
*   **Inherits:** `ReentrancyGuard`, `AccessControl`
*   **Key Structs:**
    *   `Milestone`: Represents a milestone in the escrow.
    *   `Escrow`: Represents an escrow for a bounty.
*   **Key Functions:**
    *   `createEscrow(uint256 _bountyId, uint256 _totalAmount)`: Creates a new escrow for a bounty.
    *   `addMilestone(...)`: Adds a new milestone to an escrow.
    *   `completeMilestone(uint256 _bountyId, uint256 _milestoneId, bytes32 _documentHash)`: Marks a milestone as complete.
    *   `releaseFunds(uint256 _bountyId, uint256 _milestoneId)`: Releases funds for a completed milestone.

### 2.5. `ReputationSystem.sol`

*   **Purpose:** A system for rating and tracking the reputation of lawyers on the platform.
*   **Inherits:** `AccessControl`
*   **Key Structs:**
    *   `Rating`: Represents a single rating for a lawyer.
    *   `LawyerReputation`: Represents the reputation of a lawyer.
*   **Key Functions:**
    *   `rateLawyer(address _lawyer, uint256 _bountyId, uint8 _score, string calldata _comment)`: Rates a lawyer for a completed bounty.
    *   `completeBounty(address _lawyer, uint256 _bountyId)`: Marks a bounty as completed for a lawyer.

## 3. Frontend

The frontend is a React application built with Vite, TypeScript, and Tailwind CSS.

### 3.1. Directory Structure

*   `src/components`: Reusable UI components.
*   `src/config`: Configuration files, including contract addresses and network settings.
*   `src/contexts`: React contexts for managing global state (e.g., authentication, wallet connection).
*   `src/hooks`: Custom React hooks for interacting with smart contracts and backend services.
*   `src/lib`: Library functions, including Supabase client and contract interaction helpers.
*   `src/pages`: Top-level page components.
*   `src/services`: Services for fetching data (e.g., mock data).
*   `src/types`: TypeScript type definitions.
*   `src/utils`: Utility functions.

### 3.2. Key Components

*   `App.tsx`: The root component of the application, which sets up routing.
*   `main.tsx`: The entry point of the application.
*   `Layout.tsx`: The main layout component, which includes the navbar and footer.
*   `DashboardLayout.tsx`: The layout for the user dashboards.
*   `BountyExplorer.tsx`: The page for browsing and filtering legal bounties.
*   `BountyDetails.tsx`: The page for viewing the details of a single bounty.
*   `CreateBounty.tsx`: The page for creating a new legal bounty.

## 4. Backend

The backend consists of Hardhat for smart contract deployment and management, and Supabase for database and authentication.

### 4.1. Scripts

*   `scripts/deploy.ts`: Deploys the smart contracts to the blockchain.
*   `scripts/verify.ts`: Verifies the deployed smart contracts on a block explorer.
*   `scripts/generate-key.ts`: Generates a new private key for deployment.
*   `scripts/save-addresses.ts`: Saves the deployed contract addresses to a JSON file.
*   `scripts/validate-env.ts`: Validates the environment variables required for deployment.

### 4.2. Supabase

Supabase is used for:

*   **Database:** A PostgreSQL database for storing user data, bounty information, and other application data.
*   **Authentication:** User authentication and management.
*   **Storage:** Storing user-uploaded files.

## 5. Database Schema

The database schema is defined by the Supabase migrations in the `supabase/migrations` directory.

### 5.1. Tables

*   `users`: Stores user information.
*   `bounties`: Stores information about legal bounties.
*   `milestones`: Stores information about bounty milestones.
*   `donations`: Stores information about donations to bounties.
*   `lawyer_applications`: Stores applications from lawyers for bounties.
*   `lawyer_reviews`: Stores reviews and ratings for lawyers.
*   `lawyer_specializations`: Stores the specializations of lawyers.
*   `documents`: Stores metadata for user-uploaded documents.
*   `lawyer_cases`: Stores information about cases assigned to lawyers.
*   `case_notes`: Stores notes for lawyer cases.
*   `case_events`: Stores events for lawyer cases.
*   `case_invoices`: Stores invoices for lawyer cases.
*   `lawyer_matching_preferences`: Stores the matching preferences of lawyers.
*   `lawyer_matching_scores`: Stores the matching scores of lawyers for bounties.
*   `donor_preferences`: Stores the preferences of donors.
*   `donor_tax_documents`: Stores tax documents for donors.
*   `recurring_donations`: Stores information about recurring donations.
*   `donation_shares`: Stores information about shared donations.

## 6. Configuration

The project's configuration is managed through a set of files:

*   `.env`: Stores environment variables, including private keys, API keys, and database connection strings.
*   `hardhat.config.ts`: The configuration file for Hardhat.
*   `tsconfig.json`: The configuration file for TypeScript.
*   `vite.config.ts`: The configuration file for Vite.
*   `tailwind.config.js`: The configuration file for Tailwind CSS.
