#!/bin/bash

# HakiChain Chat Enhancement Migration Script
echo "🚀 Running HakiChain Chat Enhancement Migration..."

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Run the chat messages table migration
echo "📊 Creating chat_messages table..."
supabase db push

if [ $? -eq 0 ]; then
    echo "✅ Chat messages table created successfully!"
    echo ""
    echo "🎉 HakiBot enhancements are now ready!"
    echo ""
    echo "✨ New Features:"
    echo "   • Auto-scroll control during AI generation"
    echo "   • Conversation history with search"
    echo "   • Export chat sessions"
    echo "   • Persistent chat sessions"
    echo "   • User scroll detection"
    echo ""
    echo "🔧 Components enhanced:"
    echo "   • LegalChatbot with history integration"
    echo "   • Chat history service with full CRUD"
    echo "   • Database schema with RLS policies"
    echo ""
    echo "💡 Usage:"
    echo "   • Users can now pause auto-scroll during generation"
    echo "   • Access chat history via the History button"
    echo "   • Export conversations as JSON files"
    echo "   • Search through previous conversations"
else
    echo "❌ Migration failed. Please check your Supabase connection."
    exit 1
fi
