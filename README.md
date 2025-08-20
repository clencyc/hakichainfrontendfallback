
# HakiChain v2.2.1

HakiChain is a decentralized platform for legal services and intellectual property protection, built on blockchain technology. The platform enables secure document management, legal bounties, milestone-based escrow services for legal professionals. There are AI-powered tools for lawyers to make their workflows easier.

## 🌟 Features

- **Document Registry**: Secure storage and verification of legal documents on the blockchain
- **Legal Bounty System**: Post and claim legal tasks with transparent reward distribution
- **Milestone Escrow**: Secure payment handling for legal services with milestone-based releases
- **HakiToken**: Native utility token for platform operations  
 


## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Vite
- **Smart Contracts**: Solidity, Hardhat
- **Backend**: Supabase
- **Blockchain**: Ethereum
- **UI Components**: Headless UI, Framer Motion
- **State Management**: React Query
- **Form Handling**: React Hook Form, Zod
- **Data Visualization**: Recharts

## 🚀 Getting Started today


### Prerequisites

- Node.js (Latest LTS version)
- npm or yarn
- MetaMask or compatible Web3 wallet
- Hardhat development environment

### Installation

1. Clone the repository:

```bash
git clone https://github.com/MercyMurigi/hakichain_v2.git
cd hakichain_v2
```

1. Install dependencies:

```bash
npm install
```

1. Set up environment variables:

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

1. Start the development server:

```bash
npm run dev
```

### Smart Contract Development

1. Compile contracts:

```bash
npm run compile
```

1. Run tests:

```bash
npm run test
```

1. Deploy contracts:

```bash
npm run deploy
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run compile` - Compile smart contracts
- `npm run test` - Run smart contract tests
- `npm run deploy` - Deploy smart contracts

## 🔒 Smart Contracts

- `HakiToken.sol` - ERC20 token for platform operations
- `DocumentRegistry.sol` - Document storage and verification system
- `LegalBounty.sol` - Legal task management and reward distribution
- `MilestoneEscrow.sol` - Secure payment handling for legal services
- `ReputationSystem.sol` - Trust and reputation management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ by the HakiChain Team
