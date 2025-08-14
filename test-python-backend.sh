#!/bin/bash

# HakiLens Python Backend Integration Test
# This script tests the connection to your Python backend on localhost:5007

echo "🧪 Testing HakiLens Python Backend Integration..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
PYTHON_BACKEND="http://localhost:5007"
NODEJS_BACKEND="http://localhost:8001"

echo -e "${BLUE}Testing Python Backend: ${PYTHON_BACKEND}${NC}"
echo "----------------------------------------"

# Function to test endpoint
test_endpoint() {
    local url=$1
    local method=$2
    local data=$3
    local description=$4
    
    echo -e "${YELLOW}Testing: ${description}${NC}"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X GET "${url}" \
            -H "Content-Type: application/json" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" -X POST "${url}" \
            -H "Content-Type: application/json" \
            -d "${data}" 2>/dev/null)
    fi
    
    # Extract HTTP status code
    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ Success (${http_code})${NC}"
        echo "Response: ${response_body}" | head -c 200
        echo "..."
    else
        echo -e "${RED}❌ Failed (${http_code})${NC}"
        echo "Response: ${response_body}"
    fi
    echo ""
}

# Test 1: Check if Python backend is running
echo -e "${BLUE}1. Backend Health Check${NC}"
test_endpoint "${PYTHON_BACKEND}/mobile/features" "GET" "" "Mobile Features Endpoint"

# Test 2: Quick Search
echo -e "${BLUE}2. Quick Search Test${NC}"
search_data='{
    "query": "constitutional petition",
    "filters": {
        "court": "High Court",
        "year": "2024"
    },
    "limit": 5,
    "user_id": "test_user_123"
}'
test_endpoint "${PYTHON_BACKEND}/mobile/quick_search" "POST" "$search_data" "Quick Search"

# Test 3: Scan Analysis
echo -e "${BLUE}3. Scan Analysis Test${NC}"
scan_data='{
    "scan_data": "CASE_12345_2024_HC",
    "scan_type": "qr_code",
    "user_id": "test_user_123"
}'
test_endpoint "${PYTHON_BACKEND}/mobile/scan_analysis" "POST" "$scan_data" "QR Code Scan Analysis"

# Test 4: Voice Query
echo -e "${BLUE}4. Voice Query Test${NC}"
voice_data='{
    "audio_text": "Find cases related to land disputes in 2024",
    "confidence_score": 0.95,
    "user_id": "test_user_123"
}'
test_endpoint "${PYTHON_BACKEND}/mobile/voice_query" "POST" "$voice_data" "Voice Query Processing"

# Test 5: Offline Sync
echo -e "${BLUE}5. Offline Sync Test${NC}"
test_endpoint "${PYTHON_BACKEND}/mobile/sync?limit=10" "GET" "" "Offline Data Sync"

# Test 6: Favorites Management
echo -e "${BLUE}6. Favorites Test${NC}"
favorite_data='{
    "case_id": "case_test_12345",
    "user_id": "test_user_123"
}'
test_endpoint "${PYTHON_BACKEND}/mobile/favorites" "POST" "$favorite_data" "Add to Favorites"

# Test 7: Get Favorites List
test_endpoint "${PYTHON_BACKEND}/mobile/favorites/test_user_123" "GET" "" "Get Favorites List"

# Test 8: Case Comparison
echo -e "${BLUE}7. Case Comparison Test${NC}"
comparison_data='{
    "case_ids": ["case_1", "case_2", "case_3"],
    "user_id": "test_user_123"
}'
test_endpoint "${PYTHON_BACKEND}/mobile/compare_cases" "POST" "$comparison_data" "Case Comparison"

# Test 9: User History
echo -e "${BLUE}8. User History Test${NC}"
test_endpoint "${PYTHON_BACKEND}/mobile/history/test_user_123?type=all&limit=5" "GET" "" "User Activity History"

echo ""
echo "================================================"
echo -e "${BLUE}Testing Node.js Backend: ${NODEJS_BACKEND}${NC}"
echo "----------------------------------------"

# Test Node.js backend health
test_endpoint "${NODEJS_BACKEND}/health" "GET" "" "Node.js Health Check"

echo ""
echo "================================================"
echo -e "${GREEN}Integration Test Complete!${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Ensure your Python backend is running on localhost:5007"
echo "2. Check that all required endpoints are implemented"
echo "3. Test the React frontend integration"
echo "4. Verify database connectivity"
echo ""
echo -e "${BLUE}Frontend Integration:${NC}"
echo "- Import the enhanced service: import { hakiLensAPI } from '../../services/EnhancedHakiLensAPI'"
echo "- Use the React component: <HakiLensPythonIntegration />"
echo "- The service will automatically try Python backend first, then fallback to Node.js"
echo ""
echo -e "${YELLOW}Environment Variables:${NC}"
echo "Add to your .env file:"
echo "VITE_PYTHON_BACKEND_URL=http://localhost:5007"
echo "VITE_NODEJS_BACKEND_URL=http://localhost:8001"
