#!/bin/bash

echo "🔧 Supabase Credentials Update Script"
echo "======================================"

# Backup current .env
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Created backup of current .env file"

echo ""
echo "Please provide your new Supabase credentials:"
echo ""

read -p "📍 Supabase URL (e.g., https://yourproject.supabase.co): " NEW_URL
read -p "🔑 Supabase Anon Key: " NEW_KEY

if [ -z "$NEW_URL" ] || [ -z "$NEW_KEY" ]; then
    echo "❌ Error: Both URL and API key are required"
    exit 1
fi

# Update .env file
sed -i.bak "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=$NEW_URL|" .env
sed -i.bak "s|VITE_SUPABASE_ANON_KEY=.*|VITE_SUPABASE_ANON_KEY=$NEW_KEY|" .env

echo ""
echo "✅ Updated .env file with new credentials"
echo ""
echo "🔄 Restarting development server..."

# Kill existing dev server
pkill -f "vite\|npm run dev" 2>/dev/null

# Start new dev server
npm run dev &

echo ""
echo "✅ Development server restarted"
echo "🧪 Testing connection..."

# Wait a moment for server to start
sleep 3

# Test the connection
node test-supabase-detailed.js

echo ""
echo "📝 If the test passes, your reminder creation should now work!"
echo "🗑️  You can delete the test files when done:"
echo "   rm test-supabase.js test-supabase-detailed.js SUPABASE_DEBUG_REPORT.md"
