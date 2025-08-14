# HakiChain Development Guide

This guide is specifically for developers working on the HakiChain project.

## 🏗 Development Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React App     │    │  Express Server  │    │ HakiLens Backend│
│  (Port 3000)    │◄──►│   (Port 3001)    │◄──►│   (Port 5007)   │
│                 │    │                  │    │                 │
│ - HakiLens UI   │    │ - API Proxy      │    │ - Case Scraping │
│ - Case Details  │    │ - CORS Handling  │    │ - AI Processing │
│ - AI Chat       │    │ - Static Routes  │    │ - Database      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔧 Development Workflow

### Starting Development Environment

```bash
# Option 1: Start everything at once (recommended)
npm run dev:all

# Option 2: Start services individually
npm run dev        # Frontend only
npm run api        # Express server only
npm run hakilens   # HakiLens backend only
```

### Making Code Changes

1. **Frontend Changes** (`src/` directory):
   - Changes auto-reload via Vite HMR
   - Check browser console for errors
   - Use React DevTools for debugging

2. **Backend Changes** (`server.js`, `api/` directory):
   - Requires manual server restart
   - Use `nodemon` for auto-restart in development

3. **HakiLens Changes**:
   - Python backend changes need restart
   - Use `npm run hakilens:dev` for auto-reload

### Key Development Files

```
src/
├── pages/lawyer/
│   ├── HakiLens.tsx              # Main legal research interface
│   └── HakiLensCaseDetails.tsx   # Individual case view with AI chat
├── components/layout/
│   └── LawyerDashboardLayout.tsx # Shared lawyer dashboard layout
└── App.tsx                       # Main routing configuration

server.js                         # Express proxy server
api/                              # Serverless API functions
├── send-sms-reminder-v2.js      # SMS reminder functionality
└── dashboard-metrics.js         # Dashboard metrics API
```

## 🔍 HakiLens Development

### Architecture Overview

HakiLens is the AI-powered legal research system with these components:

1. **Frontend Interface** (`HakiLens.tsx`):
   - Case scraping controls
   - Case database browser
   - AI assistant interface

2. **Case Details Page** (`HakiLensCaseDetails.tsx`):
   - Individual case information
   - AI chat functionality
   - Document and image viewing

3. **Express Proxy** (`server.js`):
   - Routes `/api/hakilens/*` to backend
   - Handles CORS for external APIs
   - Provides health checks

### API Endpoints

#### HakiLens API Routes (via proxy)
```
GET    /api/hakilens/cases                    # List cases
GET    /api/hakilens/cases/:id                # Get case details
POST   /api/hakilens/ai/chat/:id              # Chat with case-specific AI
POST   /api/hakilens/ai/ask                   # General AI questions
POST   /api/hakilens/ai/summarize/:id         # Generate case summary
POST   /api/hakilens/scrape/url               # Auto-detect scraping
POST   /api/hakilens/scrape/listing           # Scrape case listings
POST   /api/hakilens/scrape/case              # Scrape single case
GET    /api/hakilens/cases/:id/documents      # Get case documents
GET    /api/hakilens/cases/:id/images         # Get case images
```

#### Express Server Routes
```
GET    /api/health                            # Health check
POST   /api/send-sms-reminder-v2              # SMS reminders
GET    /api-docs                              # API documentation
```

### Development Setup for HakiLens

1. **Configure Backend URL**:
   ```bash
   # .env
   HAKILENS_API_URL=http://localhost:5007
   NGROK_URL=https://your-ngrok-url.ngrok-free.app  # Optional
   ```

2. **Start HakiLens Backend**:
   ```bash
   # Development mode with auto-reload
   npm run hakilens:dev
   
   # Production mode
   npm run hakilens
   
   # Test connection
   curl http://localhost:5007/health
   ```

3. **Using ngrok for External APIs** (optional):
   ```bash
   # Install ngrok
   npm install -g ngrok
   
   # Expose local backend
   ngrok http 5007
   
   # Update server.js with new URL
   ```

### Testing HakiLens

```bash
# Test the Python backend
npm run hakilens:test

# Test API endpoints
curl http://localhost:3001/api/hakilens/cases
curl http://localhost:3001/api/health

# Test case chat
curl -X POST http://localhost:3001/api/hakilens/ai/chat/123 \
  -H "Content-Type: application/json" \
  -d '{"message": "What is this case about?"}'
```

## 🎯 Code Structure

### React Components

#### HakiLens.tsx
```typescript
// Main interface with three tabs:
// 1. Research Cases - Extract cases from websites
// 2. Case Database - Browse existing cases  
// 3. AI Assistant - Ask questions about cases

const HakiLens = () => {
  const [activeTab, setActiveTab] = useState('scrape');
  const [cases, setCases] = useState<Case[]>([]);
  
  // API calls use '/api/hakilens' proxy
  const API_BASE = '/api/hakilens';
  
  // Navigation to case details
  onClick={() => navigate(`/lawyer/hakilens/case/${caseItem.id}`)}
};
```

#### HakiLensCaseDetails.tsx
```typescript
// Individual case view with AI chat
const HakiLensCaseDetails = () => {
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Case-specific AI chat
  const handleSendMessage = async () => {
    const response = await fetch(`${API_BASE}/ai/chat/${caseId}`, {
      method: 'POST',
      body: JSON.stringify({ message: inputMessage })
    });
  };
};
```

### Express Server (server.js)

```javascript
// HakiLens proxy middleware
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use('/api/hakilens', createProxyMiddleware({
  target: process.env.HAKILENS_API_URL || 'http://localhost:5007',
  changeOrigin: true,
  pathRewrite: { '^/api/hakilens': '' },
  onError: (err, req, res) => {
    console.error('HakiLens proxy error:', err);
    res.status(500).json({ error: 'HakiLens service unavailable' });
  }
}));
```

## 🔄 State Management

The application uses React hooks for state management:

- **Local State**: `useState` for component-specific data
- **Effects**: `useEffect` for data fetching and lifecycle
- **Callbacks**: `useCallback` for optimized event handlers
- **Memoization**: `useMemo` for expensive calculations

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animations and transitions
- **Lucide React**: Icon library
- **Responsive Design**: Mobile-first approach

## 🧪 Testing

### Manual Testing Checklist

1. **Frontend**:
   - [ ] Homepage loads correctly
   - [ ] Navigation works between pages
   - [ ] HakiLens interface loads
   - [ ] Case cards display properly

2. **HakiLens Features**:
   - [ ] Cases load in database tab
   - [ ] Case details page opens
   - [ ] AI chat responds to messages
   - [ ] Case scraping works
   - [ ] Search functionality works

3. **API Integration**:
   - [ ] Express server responds to health checks
   - [ ] Proxy routes work correctly
   - [ ] CORS headers allow frontend access
   - [ ] Error handling displays user-friendly messages

### Debugging Tips

1. **Frontend Issues**:
   ```bash
   # Check browser console
   # Use React DevTools
   # Verify API calls in Network tab
   ```

2. **Backend Issues**:
   ```bash
   # Check Express server logs
   curl http://localhost:3001/api/health
   # Verify proxy configuration
   ```

3. **HakiLens Issues**:
   ```bash
   # Test Python backend directly
   curl http://localhost:5007/health
   # Check proxy logs
   # Verify ngrok tunnel (if used)
   ```

## 📦 Build Process

```bash
# Development build (with source maps)
npm run dev

# Production build (optimized)
npm run build

# Preview production build
npm run preview

# Check build size
npm run build && du -sh dist/
```

## 🚀 Deployment Considerations

1. **Environment Variables**: Ensure all required vars are set in production
2. **API URLs**: Update backend URLs for production environment
3. **CORS**: Configure for production domains
4. **Build Optimization**: Enable compression and caching
5. **Error Monitoring**: Add error tracking service

## 📝 Contributing Guidelines

1. **Code Style**: Follow existing patterns and ESLint rules
2. **Commit Messages**: Use conventional commit format
3. **Testing**: Test changes manually before committing
4. **Documentation**: Update docs for new features
5. **Error Handling**: Always include proper error handling

---

Happy developing! 🚀
