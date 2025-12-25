import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Layout } from '@/components/layout';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PortfolioSummary, PortfolioCard } from '@/components/portfolio';
import { mockUserInvestments, mockTransactions } from '@/data/mockData';
import { 
  Wallet, 
  ArrowRight, 
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Coins
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Badge } from '@/components/ui/badge';

const Portfolio = () => {
  const { isConnected, address } = useAccount();

  if (!isConnected) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md mx-auto"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <Wallet className="h-10 w-10 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold mb-4">Connect Your Wallet</h1>
              <p className="text-muted-foreground mb-8">
                Connect your wallet to view your investment portfolio and claim dividends.
              </p>
              <ConnectButton />
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  const totalClaimable = mockUserInvestments.reduce((sum, inv) => sum + inv.claimableDividends, 0);

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="font-display text-4xl font-bold mb-2">
                My <span className="gradient-text">Portfolio</span>
              </h1>
              <p className="text-muted-foreground">
                Track your investments and earnings across all businesses
              </p>
            </div>
            {totalClaimable > 0 && (
              <Button variant="gradient" size="lg" className="gap-2">
                <Coins className="h-5 w-5" />
                Claim All (${totalClaimable.toFixed(2)})
              </Button>
            )}
          </motion.div>

          {/* Portfolio Summary */}
          <PortfolioSummary investments={mockUserInvestments} />

          {/* Investments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-xl font-semibold mb-4">Your Investments</h2>
            {mockUserInvestments.length > 0 ? (
              <div className="space-y-4">
                {mockUserInvestments.map((investment, index) => (
                  <PortfolioCard
                    key={investment.businessId}
                    investment={investment}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            ) : (
              <GlassCard className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
                  <Wallet className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">No Investments Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start building your portfolio by investing in verified businesses
                </p>
                <Link to="/businesses">
                  <Button variant="gradient" className="gap-2">
                    Explore Businesses <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </GlassCard>
            )}
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="font-display text-xl font-semibold mb-4">Recent Transactions</h2>
            <GlassCard>
              {mockTransactions.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {mockTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          tx.type === 'investment' ? 'bg-primary/10' : 'bg-success/10'
                        }`}>
                          {tx.type === 'investment' ? (
                            <ArrowUpRight className="h-5 w-5 text-primary" />
                          ) : (
                            <ArrowDownLeft className="h-5 w-5 text-success" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{tx.businessName}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {tx.type.replace('_', ' ')}
                            {tx.tokenAmount && ` • ${tx.tokenAmount} tokens`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          tx.type === 'investment' ? '' : 'text-success'
                        }`}>
                          {tx.type === 'investment' ? '-' : '+'}${tx.amount.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 justify-end">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {tx.timestamp.toLocaleDateString()}
                          </span>
                          <Badge variant={tx.status === 'confirmed' ? 'success' : 'secondary'} className="text-xs">
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No transactions yet
                </p>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
