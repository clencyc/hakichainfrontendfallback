# HakiChain Project Setup Guide

This guide provides comprehensive instructions for setting up and running the HakiChain project locally. HakiChain is a legal tech platform featuring case management, AI-powered legal research, and blockchain integration.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Installation](#installation)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [HakiLens Legal Research System](#hakilens-legal-research-system)
7. [API Documentation](#api-documentation)
8. [Development Tools](#development-tools)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

## 🛠 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- **Python** (v3.8 or higher) - Required for HakiLens backend
- **ngrok** (optional) - For exposing local servers to external APIs

### Verify Prerequisites

```bash
node --version    # Should be v18.0.0+
npm --version     # Should be 8.0.0+
python --version  # Should be 3.8+
git --version     # Any recent version
```

## 📁 Project Structure

```
hakichain_v2/
├── src/                          # React frontend source code
│   ├── components/               # Reusable UI components
│   ├── pages/                   # Application pages
│   │   └── lawyer/              # Lawyer dashboard pages
│   │       ├── HakiLens.tsx     # Legal research interface
│   │       └── HakiLensCaseDetails.tsx # Case detail view
│   ├── contexts/                # React contexts
│   ├── hooks/                   # Custom React hooks
│   └── utils/                   # Utility functions
├── api/                         # Serverless API functions
├── contracts/                   # Smart contracts (Solidity)
├── scripts/                     # Deployment and utility scripts
├── server.js                    # Express.js proxy server
├── hakilens-server.js          # HakiLens Python backend server
├── package.json                # Node.js dependencies
├── vite.config.ts              # Vite configuration
├── hardhat.config.ts           # Hardhat blockchain config
└── .env                        # Environment variables
```

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/HakiChain-Main/Hakichain-Site.git
cd hakichain_v2
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Alternative with yarn
yarn install
```

### 3. Install Python Dependencies (for HakiLens)

```bash
# Create a virtual environment (recommended)
python -m venv hakilens-env
source hakilens-env/bin/activate  # On Windows: hakilens-env\Scripts\activate

# Install Python packages
pip install -r requirements.txt  # If requirements.txt exists
# Or install individually:
pip install fastapi uvicorn python-multipart requests beautifulsoup4
```

## 🔧 Environment Configuration

### 1. Create Environment File

Create a `.env` file in the project root:

```bash
cp .env.example .env  # If example exists
# Or create manually:
touch .env
```

### 2. Configure Environment Variables

Add the following variables to your `.env` file:

```env
# Application Configuration
NODE_ENV=development
PORT=3001
VITE_APP_NAME=HakiChain

# Supabase Configuration (for database)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Blockchain Configuration (Lisk Network)
LISK_TESTNET_RPC_URL=https://rpc.sepolia-api.lisk.com
LISK_MAINNET_RPC_URL=https://rpc.api.lisk.com
PRIVATE_KEY=your_wallet_private_key

# AI Services
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_google_gemini_api_key

# HakiLens Configuration
HAKILENS_API_URL=http://localhost:5007
NGROK_URL=your_ngrok_tunnel_url

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# SMS Configuration (optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

### 3. Configure HakiLens Backend

If using the HakiLens legal research system, you'll need a Python backend. The system can work with:

- **Local Python Server** (recommended for development)
- **ngrok Tunnel** (for external API access)
- **Remote API Endpoint**

## 🚀 Running the Application

### Method 1: Full Development Setup (Recommended)

Run both frontend and backend simultaneously:

```bash
# Install dependencies first
npm install

# Start both frontend and Express server
npm run dev:all
```

This command starts:
- React frontend on `http://localhost:3000`
- Express proxy server on `http://localhost:3001`

### Method 2: Individual Services

#### Start Frontend Only

```bash
npm run dev
```
- Frontend: `http://localhost:3000`
- Proxy automatically forwards API calls to port 3001

#### Start Express Server Only

```bash
npm run api
# or
PORT=3001 node server.js
```
- Express server: `http://localhost:3001`
- API documentation: `http://localhost:3001/api-docs`

#### Start HakiLens Backend

```bash
# Option 1: Node.js wrapper (if available)
npm run hakilens

# Option 2: Direct Python server
python hakilens-server.py

# Option 3: With development auto-reload
npm run hakilens:dev
```

### Method 3: Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔍 HakiLens Legal Research System

HakiLens is an AI-powered legal research tool integrated into HakiChain. It provides case scraping, database management, and AI analysis.

### Features

1. **Case Scraping**: Extract legal cases from various court websites
2. **Case Database**: Browse and search through Researchd cases
3. **AI Assistant**: Ask questions about legal cases using AI
4. **Case Chat**: Interactive AI chat for specific cases

### Setting up HakiLens

1. **Start the HakiLens Backend**:
   ```bash
   npm run hakilens:dev
   ```

2. **Configure ngrok (if needed)**:
   ```bash
   # Install ngrok
   npm install -g ngrok

   # Expose local server
   ngrok http 5007

   # Update .env with ngrok URL
   NGROK_URL=https://your-ngrok-url.ngrok-free.app
   ```

3. **Test the Integration**:
   ```bash
   npm run hakilens:test
   ```

### Using HakiLens

1. Navigate to `/lawyer/hakilens` in the application
2. Use the **Research Cases** tab to extract cases from legal websites
3. Browse cases in the **Case Database** tab
4. Ask questions using the **AI Assistant** tab
5. Click on any case to view detailed information and chat with AI

## 📚 API Documentation

### Express Server Endpoints

- **Health Check**: `GET /api/health`
- **SMS Reminders**: `POST /api/send-sms-reminder-v2`
- **HakiLens Proxy**: `/api/hakilens/*` (proxies to HakiLens backend)

### HakiLens API Endpoints

- **Cases**: `GET /api/hakilens/cases`
- **Case Details**: `GET /api/hakilens/cases/:id`
- **Case Chat**: `POST /api/hakilens/ai/chat/:id`
- **AI Ask**: `POST /api/hakilens/ai/ask`
- **Scraping**: `POST /api/hakilens/scrape/*`

### Accessing API Documentation

1. Start the Express server: `npm run api`
2. Visit: `http://localhost:3001/api-docs`
3. Interactive API testing available through Swagger UI

## 🛠 Development Tools

### Available Scripts

```bash
# Development
npm run dev              # Start Vite dev server
npm run dev:all          # Start frontend + Express server
npm run dev:python       # Start with Python backend integration

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Linting & Testing
npm run lint             # Run ESLint
npm run test             # Run Hardhat tests

# Blockchain Development
npm run compile          # Compile smart contracts
npm run deploy           # Deploy to Lisk testnet
npm run deploy:mainnet   # Deploy to Lisk mainnet
npm run verify           # Verify contracts on block explorer

# HakiLens Development
npm run hakilens         # Start HakiLens server
npm run hakilens:dev     # Start with auto-reload
npm run hakilens:test    # Test HakiLens integration
```

### Development Workflow

1. **Start Development Environment**:
   ```bash
   npm run dev:all
   ```

2. **Make Changes**: Edit files in `src/` directory

3. **Test Changes**: 
   - Frontend automatically reloads
   - API changes require server restart

4. **Test HakiLens Features**:
   ```bash
   npm run hakilens:test
   ```

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the Project**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Deploy to Netlify**:
   - Upload `dist/` folder to Netlify
   - Or connect GitHub repository

### Backend Deployment

1. **Express Server**: Deploy to services like Railway, Render, or Heroku
2. **HakiLens Backend**: Deploy Python service to cloud providers
3. **Environment Variables**: Configure all environment variables in production

### Smart Contract Deployment

```bash
# Compile contracts
npm run compile

# Deploy to testnet
npm run deploy

# Verify on block explorer
npm run verify

# Deploy to mainnet (when ready)
npm run deploy:mainnet
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Error: EADDRINUSE: address already in use :::3001
# Kill process using the port
lsof -ti:3001 | xargs kill -9

# Or use different port
PORT=3002 npm run api
```

#### 2. CORS Errors

- Ensure Express server is running on port 3001
- Check Vite proxy configuration in `vite.config.ts`
- Verify CORS headers in `server.js`

#### 3. HakiLens Connection Issues

```bash
# Check if HakiLens backend is running
curl http://localhost:5007/health

# Test ngrok tunnel
curl https://your-ngrok-url.ngrok-free.app/health

# Restart HakiLens service
npm run hakilens:dev
```

#### 4. Environment Variables Not Loading

- Ensure `.env` file is in project root
- Restart development server after changing `.env`
- Check if variables are prefixed with `VITE_` for frontend use

#### 5. Build Errors

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run build
```

### Getting Help

1. **Check Logs**: Look at terminal output for error messages
2. **Browser Console**: Check for frontend JavaScript errors
3. **Network Tab**: Verify API calls are reaching the server
4. **GitHub Issues**: Report bugs or request features

### Performance Tips

1. **Development**:
   - Use `npm run dev:all` for full-stack development
   - Enable browser dev tools for debugging
   - Use React Developer Tools extension

2. **Production**:
   - Run `npm run build` to optimize bundle
   - Use CDN for static assets
   - Enable compression on server

## 🎯 Next Steps

After successful setup:

1. **Explore the Application**: Visit `http://localhost:3000`
2. **Try HakiLens**: Navigate to `/lawyer/hakilens`
3. **Read the Code**: Start with `src/App.tsx` and `src/pages/`
4. **Customize**: Modify components and styling to fit your needs
5. **Deploy**: Follow deployment instructions for your preferred platform

## 📄 Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Express.js Documentation](https://expressjs.com/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Lisk Network Documentation](https://docs.lisk.com/)

---

**Need help?** Create an issue in the GitHub repository or contact the development team.
