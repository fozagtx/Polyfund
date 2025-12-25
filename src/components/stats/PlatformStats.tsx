import { motion } from 'framer-motion';
import { Building2, DollarSign, Users, Coins } from 'lucide-react';
import { StatCard } from './StatCard';
import { PlatformStats as PlatformStatsType } from '@/types';

interface PlatformStatsProps {
  stats: PlatformStatsType;
}

export function PlatformStats({ stats }: PlatformStatsProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl font-bold mb-4">
            Platform <span className="gradient-text">Statistics</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join thousands of investors building diversified portfolios of real-world assets
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Businesses"
            value={stats.totalBusinesses.toString()}
            change={12.5}
            icon={Building2}
            delay={0.1}
          />
          <StatCard
            title="Investment Volume"
            value={formatCurrency(stats.totalInvestmentVolume)}
            change={24.3}
            icon={DollarSign}
            delay={0.2}
          />
          <StatCard
            title="Dividends Paid"
            value={formatCurrency(stats.totalDividendsPaid)}
            change={18.7}
            icon={Coins}
            delay={0.3}
          />
          <StatCard
            title="Active Investors"
            value={formatNumber(stats.totalInvestors)}
            change={32.1}
            icon={Users}
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
}
