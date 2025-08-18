# HakiChain Quick Start Guide

Get HakiChain running in 5 minutes! 🚀

## ⚡ Quick Setup

### 1. Prerequisites Check
```bash
node --version   # Need v18+
npm --version    # Need v8+
```

### 2. Clone & Install
```bash
git clone https://github.com/HakiChain-Main/Hakichain-Site.git
cd hakichain_v2
npm install
```

### 3. Environment Setup
```bash
# Create environment file
touch .env

# Add minimal required variables:
echo "NODE_ENV=development" >> .env
echo "PORT=3001" >> .env
echo "VITE_APP_NAME=HakiChain" >> .env
```

### 4. Start Development Server
```bash
# Start both frontend and backend
npm run dev:all
```

**🎉 That's it!** Your application should now be running:
- **Frontend**: http://localhost:3000
- **API Server**: http://localhost:3001

## 🔍 Quick Test

1. Open http://localhost:3000 in your browser
2. Navigate to `/lawyer/hakilens` for the legal research system
3. Check http://localhost:3001/api/health for API status

## 🛠 Individual Services

If you need to run services separately:

```bash
# Frontend only
npm run dev

# API server only
npm run api

# HakiLens backend (if available)
npm run hakilens
```

## 🚨 Common Quick Fixes

### Port Already in Use
```bash
# Kill processes on ports 3000/3001
npx kill-port 3000 3001
# Then restart
npm run dev:all
```

### Missing Dependencies
```bash
# Reinstall everything
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues
- Make sure both servers are running
- Frontend should proxy API calls automatically

## 📚 Next Steps

- **Full Setup Guide**: See `SETUP_GUIDE.md` for complete instructions
- **HakiLens Setup**: Follow HakiLens section in full guide for AI features
- **Environment Config**: Add your API keys for full functionality

## 🆘 Need Help?

- Check the full `SETUP_GUIDE.md` for detailed troubleshooting
- Look at terminal output for specific error messages
- Ensure all prerequisites are installed correctly

---

**Happy coding!** 🎯
