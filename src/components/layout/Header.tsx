import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { GradientButton } from '@/components/ui/gradient-button';
import { 
  LayoutDashboard, 
  Building2, 
  Wallet, 
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
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
      {/* Fixed Top Navigation - Transparent */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-8"
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-lavender" />
                <div className="absolute inset-0.5 rounded-lg bg-background/90 flex items-center justify-center">
                  <span className="font-sans font-bold text-primary">P</span>
                </div>
              </div>
              <span className="font-sans text-lg font-bold">Polyfunds</span>
            </Link>

            {/* Desktop Navigation - Center */}
            <div className="hidden md:flex items-center gap-6">
              {visibleNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <span
                      className={`text-sm font-medium transition-colors ${
                        isActive 
                          ? 'text-foreground' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Right side - Connect Wallet */}
            <div className="hidden sm:flex items-center">
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
                              className="min-w-0 px-5 py-2.5 text-sm"
                            >
                              Connect Wallet
                            </GradientButton>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <GradientButton
                              onClick={openChainModal}
                              variant="variant"
                              className="min-w-0 px-5 py-2.5 text-sm"
                            >
                              Wrong Network
                            </GradientButton>
                          );
                        }

                        return (
                          <GradientButton
                            onClick={openAccountModal}
                            variant="variant"
                            className="min-w-0 px-5 py-2.5 text-sm"
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
              className="md:hidden p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </motion.nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/90 backdrop-blur-md md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-4 right-4"
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
                      <button
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                          isActive 
                            ? 'bg-primary/10 text-foreground' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </button>
                    </Link>
                  );
                })}
                <div className="pt-2 mt-2 border-t border-border/50">
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
