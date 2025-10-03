#!/bin/bash

# HakiLens Setup and Start Script
# This script sets up and starts all required services for HakiLens

echo "🚀 HakiLens Complete Setup and Startup"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "📝 Please update .env file with your Supabase credentials"
    else
        echo "❌ No .env.example file found. Please create .env manually."
        exit 1
    fi
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if required dependencies are installed
echo "🔍 Checking dependencies..."
required_deps=("axios" "cheerio" "cors" "@supabase/supabase-js" "express")
missing_deps=()

for dep in "${required_deps[@]}"; do
    if ! npm list "$dep" &> /dev/null; then
        missing_deps+=("$dep")
    fi
done

if [ ${#missing_deps[@]} -ne 0 ]; then
    echo "📦 Installing missing dependencies: ${missing_deps[*]}"
    npm install "${missing_deps[@]}"
fi

# Check if Supabase environment variables are set
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "⚠️  Supabase environment variables not found in current session"
    echo "   Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env"
fi

# Check if HakiLens server file exists
if [ ! -f "hakilens-server.js" ]; then
    echo "❌ hakilens-server.js not found. Please ensure the HakiLens server file exists."
    exit 1
fi

# Check if migration file exists
if [ ! -f "supabase/migrations/20250811_hakilens_tables.sql" ]; then
    echo "⚠️  HakiLens database migration file not found"
    echo "   Please ensure the migration file exists: supabase/migrations/20250811_hakilens_tables.sql"
fi

# Function to start services
start_services() {
    echo ""
    echo "🎯 Starting HakiLens Services..."
    echo "================================="
    echo ""
    
    # Check if ports are available
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port 3000 is already in use (Vite dev server)"
    fi
    
    if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port 8000 is already in use (HakiLens API)"
        echo "   Please stop the existing service or change the port"
        exit 1
    fi
    
    # Start services
    echo "🚀 Starting HakiLens API Server (Port 8000)..."
    echo "🚀 Starting Vite Dev Server (Port 3000)..."
    echo ""
    echo "📖 Services will be available at:"
    echo "   • Frontend: http://localhost:3000"
    echo "   • HakiLens API:https://hakilens-v77g.onrender.com "
    echo "   • API Docs: https://hakilens-v77g.onrender.com"
    echo "   • Health Check: https://hakilens-v77g.onrender.com/health"
    echo ""
    echo "✋ Press Ctrl+C to stop all services"
    echo ""
    
    # Use npm script to start both services
    npm run dev:all
}

# Function to run database migration
run_migration() {
    echo ""
    echo "🗃️  Database Setup"
    echo "=================="
    echo ""
    echo "To set up the HakiLens database tables, you have two options:"
    echo ""
    echo "Option 1: Using Supabase CLI (Recommended)"
    echo "   supabase migration up"
    echo ""
    echo "Option 2: Manual SQL Execution"
    echo "   1. Go to your Supabase dashboard"
    echo "   2. Open the SQL Editor"
    echo "   3. Copy and run the contents of: supabase/migrations/20250811_hakilens_tables.sql"
    echo ""
    read -p "Have you set up the database tables? (y/n): " db_setup
    
    if [[ $db_setup != "y" && $db_setup != "Y" ]]; then
        echo "Please set up the database tables first, then run this script again."
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "HakiLens Setup Script"
    echo "===================="
    echo ""
    echo "Usage: $0 [option]"
    echo ""
    echo "Options:"
    echo "  start     Start HakiLens services (default)"
    echo "  db        Show database setup instructions"
    echo "  check     Check system requirements and dependencies"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start    # Start all services"
    echo "  $0 db       # Show database setup instructions"
    echo "  $0 check    # Check system requirements"
}

# Function to check system
check_system() {
    echo "🔍 System Check"
    echo "==============="
    echo ""
    
    # Check Node.js version
    node_version=$(node --version)
    echo "Node.js version: $node_version"
    
    # Check npm version
    npm_version=$(npm --version)
    echo "npm version: $npm_version"
    
    # Check if .env exists
    if [ -f .env ]; then
        echo "✅ .env file exists"
    else
        echo "❌ .env file missing"
    fi
    
    # Check if key files exist
    files=("hakilens-server.js" "src/services/hakiLensAPI.ts" "src/pages/lawyer/HakiLensEnhanced.tsx")
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            echo "✅ $file exists"
        else
            echo "❌ $file missing"
        fi
    done
    
    # Check dependencies
    echo ""
    echo "📦 Dependencies:"
    for dep in "${required_deps[@]}"; do
        if npm list "$dep" &> /dev/null; then
            echo "✅ $dep installed"
        else
            echo "❌ $dep missing"
        fi
    done
    
    echo ""
    echo "🌐 Network Ports:"
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port 3000 is in use"
    else
        echo "✅ Port 3000 is available"
    fi
    
    if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port 8000 is in use"
    else
        echo "✅ Port 8000 is available"
    fi
}

# Main script logic
case "${1:-start}" in
    "start")
        run_migration
        start_services
        ;;
    "db")
        run_migration
        ;;
    "check")
        check_system
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        echo "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
