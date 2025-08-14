#!/bin/bash

# Quick Start Script for HakiLens Python Integration
# This script helps you quickly test the frontend with your Python backend

echo "🚀 HakiLens Python Integration - Quick Start"
echo "============================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}1. Checking Python Backend...${NC}"
if curl -s http://localhost:5007/mobile/features > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Python backend is running on localhost:5007${NC}"
else
    echo -e "${YELLOW}⚠️  Python backend not detected on localhost:5007${NC}"
    echo "   Please start your Python backend first."
    echo "   The frontend will fallback to Node.js backend if available."
fi

echo ""
echo -e "${BLUE}2. Setting up environment...${NC}"

# Create or update .env file with HakiLens configuration
if [ -f ".env" ]; then
    echo "Updating existing .env file..."
    # Backup existing .env
    cp .env .env.backup
    
    # Add HakiLens vars if they don't exist
    grep -q "VITE_PYTHON_BACKEND_URL" .env || echo "VITE_PYTHON_BACKEND_URL=http://localhost:5007" >> .env
    grep -q "VITE_NODEJS_BACKEND_URL" .env || echo "VITE_NODEJS_BACKEND_URL=http://localhost:8001" >> .env
    grep -q "VITE_HAKILENS_API_URL" .env || echo "VITE_HAKILENS_API_URL=http://localhost:5007" >> .env
else
    echo "Creating .env file from template..."
    cp .env.hakilens .env
fi

echo -e "${GREEN}✅ Environment configured${NC}"

echo ""
echo -e "${BLUE}3. Starting development server...${NC}"
echo "Frontend will be available at: http://localhost:3000"
echo "HakiLens Python Integration: http://localhost:3000/lawyer/hakilens-python"
echo ""
echo -e "${YELLOW}📝 Quick Test Checklist:${NC}"
echo "1. Navigate to: http://localhost:3000/lawyer/hakilens-python"
echo "2. Check backend status indicators (top of page)"
echo "3. Test Quick Search: Enter 'constitutional petition'"
echo "4. Test Scan Analysis: Enter 'CASE_12345_2024_HC'"
echo "5. Test Voice Query: Enter 'find land disputes in 2024'"
echo ""

# Start the development server with environment variables
echo -e "${BLUE}Starting Vite development server...${NC}"
VITE_PYTHON_BACKEND_URL=http://localhost:5007 \
VITE_NODEJS_BACKEND_URL=http://localhost:8001 \
VITE_HAKILENS_API_URL=http://localhost:5007 \
npm run dev
