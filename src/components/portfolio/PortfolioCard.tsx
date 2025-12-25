import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Coins, 
  TrendingUp, 
  ArrowUpRight,
  Wallet
} from 'lucide-react';
import { Investment } from '@/types';
import { Link } from 'react-router-dom';

interface PortfolioCardProps {
  investment: Investment;
  delay?: number;
}

export function PortfolioCard({ investment, delay = 0 }: PortfolioCardProps) {
  const profitLoss = investment.currentValue - investment.investedAmount;
  const profitLossPercentage = (profitLoss / investment.investedAmount) * 100;
  const isProfit = profitLoss >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <GlassCard className="overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Business Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold">{investment.businessName}</h3>
                <p className="text-sm text-muted-foreground">
                  {investment.tokenBalance.toLocaleString()} tokens
                </p>
              </div>
            </div>
          </div>

          {/* Value & P/L */}
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Invested</p>
              <p className="font-display font-semibold">${investment.investedAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Current Value</p>
              <p className="font-display font-semibold">${investment.currentValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">P/L</p>
              <p className={`font-display font-semibold flex items-center gap-1 ${isProfit ? 'text-success' : 'text-destructive'}`}>
                {isProfit ? '+' : ''}{profitLossPercentage.toFixed(1)}%
                <TrendingUp className={`h-4 w-4 ${!isProfit ? 'rotate-180' : ''}`} />
              </p>
            </div>
          </div>

          {/* Claimable Dividends */}
          <div className="flex items-center gap-4">
            {investment.claimableDividends > 0 && (
              <div className="bg-success/10 rounded-lg px-4 py-2 flex items-center gap-2">
                <Coins className="h-4 w-4 text-success" />
                <div>
                  <p className="text-xs text-muted-foreground">Claimable</p>
                  <p className="font-display font-bold text-success">
                    ${investment.claimableDividends.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
            <Link to={`/businesses/${investment.businessId}`}>
              <Button variant="outline" size="sm" className="gap-1">
                View <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
