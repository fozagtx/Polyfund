import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { config } from '@/config/wagmi';

import Index from './pages/Index';
import Businesses from './pages/Businesses';
import BusinessDetail from './pages/BusinessDetail';
import Portfolio from './pages/Portfolio';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function RainbowKitWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  
  const rainbowTheme = resolvedTheme === 'dark' 
    ? darkTheme({
        accentColor: 'hsl(258, 82%, 68%)',
        accentColorForeground: 'white',
        borderRadius: 'medium',
        fontStack: 'system',
      })
    : lightTheme({
        accentColor: 'hsl(258, 82%, 58%)',
        accentColorForeground: 'white',
        borderRadius: 'medium',
        fontStack: 'system',
      });

  return (
    <RainbowKitProvider theme={rainbowTheme}>
      {children}
    </RainbowKitProvider>
  );
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitWrapper>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/businesses" element={<Businesses />} />
                <Route path="/businesses/:id" element={<BusinessDetail />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </RainbowKitWrapper>
      </QueryClientProvider>
    </WagmiProvider>
  </ThemeProvider>
);

export default App;
