import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { 
  DollarSign, 
  TrendingUp, 
  Coins, 
  PieChart 
} from 'lucide-react';
import { Investment } from '@/types';

interface PortfolioSummaryProps {
  investments: Investment[];
}

export function PortfolioSummary({ investments }: PortfolioSummaryProps) {
  const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalClaimable = investments.reduce((sum, inv) => sum + inv.claimableDividends, 0);
  const totalClaimed = investments.reduce((sum, inv) => sum + inv.totalDividendsClaimed, 0);
  const overallProfitLoss = totalValue - totalInvested;
  const overallProfitLossPercentage = totalInvested > 0 ? (overallProfitLoss / totalInvested) * 100 : 0;
  const isProfit = overallProfitLoss >= 0;

  const stats = [
    {
      label: 'Total Invested',
      value: `$${totalInvested.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-foreground',
    },
    {
      label: 'Current Value',
      value: `$${totalValue.toFixed(2)}`,
      subValue: `${isProfit ? '+' : ''}${overallProfitLossPercentage.toFixed(1)}%`,
      icon: TrendingUp,
      color: isProfit ? 'text-success' : 'text-destructive',
    },
    {
      label: 'Claimable Dividends',
      value: `$${totalClaimable.toFixed(2)}`,
      icon: Coins,
      color: 'text-primary',
    },
    {
      label: 'Total Dividends Earned',
      value: `$${totalClaimed.toFixed(2)}`,
      icon: PieChart,
      color: 'text-success',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className={`font-display text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                {stat.subValue && (
                  <p className={`text-sm ${stat.color}`}>{stat.subValue}</p>
                )}
              </div>
              <div className={`p-2 rounded-lg bg-secondary/50`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
