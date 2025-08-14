#!/bin/bash

# HakiChain Supabase API Testing Script
# This script helps you discover and test your Supabase API endpoints

echo "🔍 HakiChain Supabase API Endpoint Discovery"
echo "============================================="

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | xargs)
    echo "✅ Loaded environment variables from .env"
else
    echo "❌ No .env file found. Please create one with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
    exit 1
fi

# Check if required variables are set
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ Missing required environment variables:"
    echo "   VITE_SUPABASE_URL: ${VITE_SUPABASE_URL:-'NOT SET'}"
    echo "   VITE_SUPABASE_ANON_KEY: ${VITE_SUPABASE_ANON_KEY:+SET}"
    exit 1
fi

echo ""
echo "📍 Your Supabase Project Details:"
echo "   Base URL: $VITE_SUPABASE_URL"
echo "   API URL: $VITE_SUPABASE_URL/rest/v1/"
echo "   Auth URL: $VITE_SUPABASE_URL/auth/v1/"
echo ""

# Function to make API calls
make_api_call() {
    local endpoint=$1
    local method=${2:-GET}
    local data=${3:-}
    
    echo "🔗 Testing: $method $VITE_SUPABASE_URL/rest/v1/$endpoint"
    
    if [ "$method" = "GET" ]; then
        curl -s \
            -H "apikey: $VITE_SUPABASE_ANON_KEY" \
            -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
            "$VITE_SUPABASE_URL/rest/v1/$endpoint" | \
            python3 -m json.tool 2>/dev/null || echo "Response received (not JSON or empty)"
    else
        curl -s \
            -X "$method" \
            -H "apikey: $VITE_SUPABASE_ANON_KEY" \
            -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
            -H "Content-Type: application/json" \
            ${data:+-d "$data"} \
            "$VITE_SUPABASE_URL/rest/v1/$endpoint" | \
            python3 -m json.tool 2>/dev/null || echo "Response received (not JSON or empty)"
    fi
    echo ""
}

# Test connectivity
echo "🧪 Testing Supabase Connectivity..."
echo ""

# Test basic endpoints
echo "📊 Available Tables and Data:"
echo ""

echo "1️⃣  USERS TABLE"
make_api_call "users?limit=3"

echo "2️⃣  BOUNTIES TABLE" 
make_api_call "bounties?limit=3"

echo "3️⃣  MILESTONES TABLE"
make_api_call "milestones?limit=3"

echo "4️⃣  DONATIONS TABLE"
make_api_call "donations?limit=3"

echo "5️⃣  LAWYER REMINDERS TABLE"
make_api_call "lawyer_reminders?limit=3"

echo ""
echo "🔍 Query Examples:"
echo ""

echo "6️⃣  LAWYERS ONLY"
make_api_call "users?role=eq.lawyer&limit=3"

echo "7️⃣  OPEN BOUNTIES"
make_api_call "bounties?status=eq.open&limit=3"

echo "8️⃣  HIGH PRIORITY REMINDERS"
make_api_call "lawyer_reminders?priority=eq.high&limit=3"

echo "9️⃣  BOUNTIES WITH NGO INFO"
make_api_call "bounties?select=*,ngo:users(name,organization)&limit=2"

echo "🔟 RECENT DONATIONS"
make_api_call "donations?select=*,bounty:bounties(title),donor:users(name)&limit=3&order=created_at.desc"

echo ""
echo "📝 Useful cURL Commands:"
echo ""
echo "# Get all lawyers:"
echo "curl -H \"apikey: \$VITE_SUPABASE_ANON_KEY\" -H \"Authorization: Bearer \$VITE_SUPABASE_ANON_KEY\" \"$VITE_SUPABASE_URL/rest/v1/users?role=eq.lawyer\""
echo ""
echo "# Get bounties with related data:"
echo "curl -H \"apikey: \$VITE_SUPABASE_ANON_KEY\" -H \"Authorization: Bearer \$VITE_SUPABASE_ANON_KEY\" \"$VITE_SUPABASE_URL/rest/v1/bounties?select=*,ngo:users(name),milestones(*)&limit=5\""
echo ""
echo "# Create a reminder (requires user JWT token):"
echo "curl -X POST -H \"apikey: \$VITE_SUPABASE_ANON_KEY\" -H \"Authorization: Bearer \$USER_JWT_TOKEN\" -H \"Content-Type: application/json\" -d '{\"title\":\"Test\",\"reminder_date\":\"2025-08-15\",\"reminder_time\":\"10:00\"}' \"$VITE_SUPABASE_URL/rest/v1/lawyer_reminders\""
echo ""

echo "✅ API Discovery Complete!"
echo ""
echo "📚 For complete documentation, see:"
echo "   - SUPABASE_API_DOCUMENTATION.md"
echo "   - https://supabase.com/docs/guides/api"
echo "   - Your Supabase Dashboard: https://supabase.com/dashboard/project/$(echo $VITE_SUPABASE_URL | sed 's/.*\/\/\([^.]*\).*/\1/')"
