import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/store/queryClient.js';
import { ThemeProvider } from '@/context/ThemeContext.jsx';
import { AuthProvider } from '@/context/AuthContext.jsx';
import { CartProvider } from '@/context/CartContext.jsx';
import { ToastProvider } from '@/components/common/Toast.jsx';
import { AppRouter } from '@/routes/AppRouter.jsx';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <BrowserRouter>
                <AppRouter />
              </BrowserRouter>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
