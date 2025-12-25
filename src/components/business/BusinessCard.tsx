import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  TrendingUp, 
  Coins, 
  CheckCircle,
  ArrowRight 
} from 'lucide-react';
import { Business } from '@/types';

interface BusinessCardProps {
  business: Business;
  delay?: number;
}

export function BusinessCard({ business, delay = 0 }: BusinessCardProps) {
  const soldPercentage = ((business.tokenSupply - business.availableTokens) / business.tokenSupply) * 100;
  const estimatedAnnualDividend = (business.monthlyRevenue * 12 * (business.profitMargin / 100)) / business.tokenSupply;
  const estimatedYield = ((estimatedAnnualDividend / business.tokenPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
    >
      <Card className="h-full glass-card-hover overflow-hidden group">
        {/* Category gradient header */}
        <div className="h-2 bg-gradient-to-r from-primary to-cyan-400" />
        
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="category">{business.category}</Badge>
                {business.isVerified && (
                  <Badge variant="verified" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <h3 className="font-display text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                {business.name}
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {business.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Token Sale Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Token Sale Progress</span>
              <span className="font-medium">{soldPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={soldPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{(business.tokenSupply - business.availableTokens).toLocaleString()} sold</span>
              <span>{business.availableTokens.toLocaleString()} available</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                <Coins className="h-3 w-3" />
                Token Price
              </div>
              <p className="font-display font-semibold">{business.tokenPrice} MNT</p>
            </div>
            <div className="p-3 rounded-lg bg-success/10">
              <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                <TrendingUp className="h-3 w-3" />
                Est. Yield
              </div>
              <p className="font-display font-semibold text-success">{estimatedYield.toFixed(1)}%</p>
            </div>
          </div>

          {/* Revenue Info */}
          <div className="flex justify-between items-center py-2 border-t border-border/50">
            <div>
              <p className="text-xs text-muted-foreground">Monthly Revenue</p>
              <p className="font-semibold">${business.monthlyRevenue.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Profit Margin</p>
              <p className="font-semibold text-success">{business.profitMargin}%</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <Link to={`/businesses/${business.id}`} className="w-full">
            <Button variant="gradient" className="w-full group">
              View Details
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
