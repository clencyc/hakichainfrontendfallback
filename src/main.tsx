import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { WalletProvider } from './contexts/WalletContext';
import { ToastProvider } from './components/common/Toaster';
import './index.css';
import { BountyDemoDetails } from './pages/BountyDemoDetails';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false, 
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </WalletProvider>
    </QueryClientProvider>
  </StrictMode>
);