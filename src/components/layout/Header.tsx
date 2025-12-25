import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { GradientButton } from '@/components/ui/gradient-button';
import { 
  LayoutDashboard, 
  Building2, 
  Wallet, 
  TrendingUp,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Home', icon: TrendingUp, requiresAuth: false },
  { path: '/businesses', label: 'Businesses', icon: Building2, requiresAuth: false },
  { path: '/portfolio', label: 'Portfolio', icon: Wallet, requiresAuth: false },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, requiresAuth: true },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isConnected } = useAccount();

  const visibleNavItems = navItems.filter(item => !item.requiresAuth || isConnected);

  return (
    <>
      {/* Floating Top Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-2 p-2 rounded-full bg-card/90 backdrop-blur-xl border border-border/50 shadow-lg"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 px-4">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-cyan-400 animate-pulse-slow" />
              <div className="absolute inset-0.5 rounded-lg bg-background flex items-center justify-center">
                <span className="font-display font-bold text-primary">P</span>
              </div>
            </div>
            <span className="font-display text-lg font-bold hidden sm:block">Polyfunds</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {visibleNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <GradientButton
                    variant={isActive ? 'default' : 'variant'}
                    className={`min-w-0 px-5 py-3 text-sm ${
                      isActive ? '' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </GradientButton>
                </Link>
              );
            })}
          </div>

          {/* Wallet Connect with Gradient Theme */}
          <div className="hidden sm:block pl-2 pr-1">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <GradientButton
                            onClick={openConnectModal}
                            className="min-w-0 px-5 py-3 text-sm"
                          >
                            <Wallet className="h-4 w-4 mr-2" />
                            Connect
                          </GradientButton>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <GradientButton
                            onClick={openChainModal}
                            variant="variant"
                            className="min-w-0 px-5 py-3 text-sm"
                          >
                            Wrong Network
                          </GradientButton>
                        );
                      }

                      return (
                        <GradientButton
                          onClick={openAccountModal}
                          variant="variant"
                          className="min-w-0 px-5 py-3 text-sm"
                        >
                          {account.displayName}
                        </GradientButton>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-3 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </motion.div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-md md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute top-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-lg">
                {visibleNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link 
                      key={item.path} 
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <GradientButton
                        variant={isActive ? 'default' : 'variant'}
                        className="w-full justify-start"
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </GradientButton>
                    </Link>
                  );
                })}
                <div className="pt-2 border-t border-border/50">
                  <ConnectButton.Custom>
                    {({
                      account,
                      chain,
                      openAccountModal,
                      openChainModal,
                      openConnectModal,
                      mounted,
                    }) => {
                      const ready = mounted;
                      const connected = ready && account && chain;

                      return (
                        <div
                          {...(!ready && {
                            'aria-hidden': true,
                            style: {
                              opacity: 0,
                              pointerEvents: 'none',
                              userSelect: 'none',
                            },
                          })}
                        >
                          {(() => {
                            if (!connected) {
                              return (
                                <GradientButton
                                  onClick={openConnectModal}
                                  className="w-full"
                                >
                                  <Wallet className="h-4 w-4 mr-2" />
                                  Connect Wallet
                                </GradientButton>
                              );
                            }

                            if (chain.unsupported) {
                              return (
                                <GradientButton
                                  onClick={openChainModal}
                                  variant="variant"
                                  className="w-full"
                                >
                                  Wrong Network
                                </GradientButton>
                              );
                            }

                            return (
                              <GradientButton
                                onClick={openAccountModal}
                                variant="variant"
                                className="w-full"
                              >
                                {account.displayName}
                              </GradientButton>
                            );
                          })()}
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
