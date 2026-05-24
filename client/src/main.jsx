import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="bottom-center"
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1d1f2b',
            color: '#fff',
            fontSize: '14px',
            borderRadius: '8px',
            padding: '10px 14px',
            boxShadow: '0 10px 30px rgba(15, 15, 30, 0.18)',
          },
          success: {
            iconTheme: { primary: '#4f46e5', secondary: '#fff' },
          },
          error: {
            duration: 5000,
            iconTheme: { primary: '#dc2626', secondary: '#fff' },
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>
);
