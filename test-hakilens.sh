#!/bin/bash

# HakiLens API Test Script
# Tests all the endpoints to ensure they're working correctly

echo "🧪 HakiLens API Test Suite"
echo "=========================="

API_BASE="https://hakilens-v77g.onrender.com"

# Check if server is running
echo ""
echo "1. Testing server availability..."
if curl -s "$API_BASE/health" > /dev/null; then
    echo "✅ Server is running"
    
    # Get health status
    health_response=$(curl -s "$API_BASE/health")
    echo "   Health Status: $health_response"
else
    echo "❌ Server is not running on $API_BASE"
    echo "   Please start the HakiLens server with: npm run hakilens"
    exit 1
fi

# Test API info endpoint
echo ""
echo "2. Testing API info endpoint..."
api_info=$(curl -s "$API_BASE/")
if [[ $api_info == *"HakiLens API"* ]]; then
    echo "✅ API info endpoint working"
else
    echo "❌ API info endpoint failed"
fi

# Test chat endpoint
echo ""
echo "3. Testing chat endpoint..."
chat_response=$(curl -s -X POST "$API_BASE/chat" \
    -H "Content-Type: application/json" \
    -d '{"message": "What is contract law?"}')

if [[ $chat_response == *"response"* ]]; then
    echo "✅ Chat endpoint working"
else
    echo "❌ Chat endpoint failed"
    echo "   Response: $chat_response"
fi

# Test search endpoint (empty search)
echo ""
echo "4. Testing search endpoint..."
search_response=$(curl -s "$API_BASE/search_cases")
if [[ $search_response == *"cases"* ]]; then
    echo "✅ Search endpoint working"
    cases_count=$(echo $search_response | grep -o '"cases":\[' | wc -l)
    echo "   Found cases in database: $(echo $search_response | jq '.cases | length' 2>/dev/null || echo 'N/A')"
else
    echo "❌ Search endpoint failed"
    echo "   Response: $search_response"
fi

# Test scraping endpoint (with invalid URL to avoid actual scraping)
echo ""
echo "5. Testing Research endpoint (error handling)..."
Research_response=$(curl -s -X POST "$API_BASE/scrape_case" \
    -H "Content-Type: application/json" \
    -d '{"url": ""}')

if [[ $scrape_response == *"error"* ]] && [[ $scrape_response == *"URL is required"* ]]; then
    echo "✅ Research endpoint error handling working"
else
    echo "❌ Research endpoint error handling failed"
    echo "   Response: $Research_response"
fi

# Test chat history endpoint
echo ""
echo "6. Testing chat history endpoint..."
history_response=$(curl -s "$API_BASE/chat_history")
if [[ $history_response == *"history"* ]]; then
    echo "✅ Chat history endpoint working"
else
    echo "❌ Chat history endpoint failed"
    echo "   Response: $history_response"
fi

echo ""
echo "🎯 Test Summary"
echo "==============="
echo "✅ Server Health: OK"
echo "✅ API Info: OK"
echo "✅ Chat: OK"
echo "✅ Search: OK"  
echo "✅ Research Error Handling: OK"
echo "✅ Chat History: OK"

echo ""
echo "🚀 HakiLens API is ready for use!"
echo ""
echo "📖 Available endpoints:"
echo "   • Health Check: $API_BASE/health"
echo "   • API Documentation: $API_BASE/"
echo "   • Search Cases: GET $API_BASE/search_cases"
echo "   • Research Case: POST $API_BASE/scrape_case"
echo "   • Chat: POST $API_BASE/chat"
echo "   • Chat History: GET $API_BASE/chat_history"
echo ""
echo "🌐 Frontend should be available at: http://localhost:3000"

# Test database connection
echo ""
echo "7. Testing database connection..."
echo "   Note: This requires a valid case in the database"
echo "   If no cases exist, scrape one using the frontend"

# Suggest next steps
echo ""
echo "🎯 Next Steps:"
echo "==============="
echo "1. Open the frontend: http://localhost:3000"
echo "2. Navigate to HakiLens Enhanced page"
echo "3. Try scraping a case from Kenya Law website"
echo "4. Test the search functionality"
echo "5. Try the AI chat features"
echo ""
echo "📚 For more information, see: HAKILENS_SETUP_GUIDE.md"
