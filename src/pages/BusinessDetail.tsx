import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout';
import { GlassCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { InvestmentModal } from '@/components/investment';
import { mockBusinesses } from '@/data/mockData';
import { 
  ArrowLeft,
  Building2,
  CheckCircle,
  Coins,
  DollarSign,
  ExternalLink,
  TrendingUp,
  Users,
  Calendar,
  PieChart,
  AlertCircle
} from 'lucide-react';

const BusinessDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [showInvestModal, setShowInvestModal] = useState(false);

  const business = mockBusinesses.find(b => b.id === Number(id));

  if (!business) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Business Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The business you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/businesses">
            <Button variant="gradient">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Businesses
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const soldPercentage = ((business.tokenSupply - business.availableTokens) / business.tokenSupply) * 100;
  const estimatedAnnualDividend = (business.monthlyRevenue * 12 * (business.profitMargin / 100)) / business.tokenSupply;
  const estimatedYield = (estimatedAnnualDividend / business.tokenPrice) * 100;
  const totalMarketCap = business.tokenSupply * business.tokenPrice;

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/businesses">
              <Button variant="ghost" className="mb-6 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Businesses
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                        <Building2 className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h1 className="font-display text-2xl font-bold">{business.name}</h1>
                          {business.isVerified && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="category">{business.category}</Badge>
                          {business.isVerified && <Badge variant="verified">Verified</Badge>}
                          {business.isActive && <Badge variant="success">Active</Badge>}
                        </div>
                      </div>
                    </div>
                    <a
                      href={`https://explorer.mantle.xyz/address/${business.tokenAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        View Contract <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {business.description}
                  </p>
                </GlassCard>
              </motion.div>

              {/* Token Sale Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard>
                  <h2 className="font-display text-lg font-semibold mb-4">Token Sale Progress</h2>
                  <Progress value={soldPercentage} className="h-3 mb-4" />
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-muted-foreground">Sold</p>
                      <p className="font-semibold">
                        {(business.tokenSupply - business.availableTokens).toLocaleString()} tokens
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Progress</p>
                      <p className="font-semibold text-primary">{soldPercentage.toFixed(1)}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Available</p>
                      <p className="font-semibold">
                        {business.availableTokens.toLocaleString()} tokens
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Financial Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard>
                  <h2 className="font-display text-lg font-semibold mb-4">Financial Metrics</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                        <DollarSign className="h-4 w-4" />
                        Monthly Revenue
                      </div>
                      <p className="font-display text-xl font-bold">
                        ${business.monthlyRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-success/10">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                        <TrendingUp className="h-4 w-4" />
                        Profit Margin
                      </div>
                      <p className="font-display text-xl font-bold text-success">
                        {business.profitMargin}%
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                        <PieChart className="h-4 w-4" />
                        Market Cap
                      </div>
                      <p className="font-display text-xl font-bold">
                        {totalMarketCap.toFixed(0)} MNT
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/10">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                        <Coins className="h-4 w-4" />
                        Est. Annual Yield
                      </div>
                      <p className="font-display text-xl font-bold text-primary">
                        {estimatedYield.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Dividend History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard>
                  <h2 className="font-display text-lg font-semibold mb-4">Dividend History</h2>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-success/10 mb-4">
                    <Coins className="h-8 w-8 text-success" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Dividends Paid</p>
                      <p className="font-display text-2xl font-bold text-success">
                        ${business.totalDividendsPaid.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Dividends are distributed monthly based on business profits. 
                    Token holders can claim their share at any time.
                  </p>
                </GlassCard>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Investment Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="sticky top-24"
              >
                <GlassCard className="border-primary/20">
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Token Price</p>
                    <p className="font-display text-4xl font-bold text-primary">
                      {business.tokenPrice} MNT
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Total Supply</span>
                      <span className="font-semibold">{business.tokenSupply.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Available</span>
                      <span className="font-semibold">{business.availableTokens.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Max Investment</span>
                      <span className="font-semibold">25% of supply</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Est. Dividend/Token</span>
                      <span className="font-semibold text-success">
                        ${estimatedAnnualDividend.toFixed(4)}/yr
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    onClick={() => setShowInvestModal(true)}
                  >
                    Invest Now
                  </Button>

                  <div className="mt-4 p-3 rounded-lg bg-warning/10 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Investment involves risk. Research thoroughly before investing.
                    </p>
                  </div>
                </GlassCard>

                {/* Owner Info */}
                <GlassCard className="mt-6">
                  <h3 className="font-display font-semibold mb-3">Business Owner</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono truncate">{business.owner}</p>
                      <a
                        href={`https://explorer.mantle.xyz/address/${business.owner}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        View on Explorer <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Modal */}
      <InvestmentModal
        business={business}
        isOpen={showInvestModal}
        onClose={() => setShowInvestModal(false)}
      />
    </Layout>
  );
};

export default BusinessDetail;
