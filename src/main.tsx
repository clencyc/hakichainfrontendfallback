import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import { WalletProvider } from './contexts/WalletContext';
import { ToastProvider } from './components/common/Toaster';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false, 
    },
  },
});

// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
// if (!PUBLISHABLE_KEY) {
//   throw new Error("Missing Clerk Publishable Key");
// }

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    {/* <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      afterSignOutUrl="/"
      appearance={{
        variables: {
          colorPrimary: '#2563eb', // Blue theme
        }
      }}
    > */}
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </WalletProvider>
      </QueryClientProvider>
    {/* </ClerkProvider> */}
  </StrictMode>
);