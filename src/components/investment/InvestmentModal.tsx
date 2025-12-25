import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Coins, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Loader2 
} from 'lucide-react';
import { Business } from '@/types';
import { CONSTANTS } from '@/config/contracts';
import { useAccount } from 'wagmi';
import { useToast } from '@/hooks/use-toast';

interface InvestmentModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
}

export function InvestmentModal({ business, isOpen, onClose }: InvestmentModalProps) {
  const { isConnected } = useAccount();
  const { toast } = useToast();
  const [tokenAmount, setTokenAmount] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');

  const totalCost = tokenAmount * business.tokenPrice;
  const ownershipPercentage = (tokenAmount / business.tokenSupply) * 100;
  const maxTokens = Math.min(
    business.availableTokens,
    Math.floor((business.tokenSupply * CONSTANTS.MAX_INVESTMENT_PERCENTAGE) / 100)
  );
  const estimatedAnnualDividend = (business.monthlyRevenue * 12 * (business.profitMargin / 100) / business.tokenSupply) * tokenAmount;

  const handleInvest = async () => {
    if (!isConnected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to invest',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setStep('success');
    
    toast({
      title: 'Investment successful!',
      description: `You now own ${tokenAmount} tokens of ${business.name}`,
    });
  };

  const handleClose = () => {
    setStep('input');
    setTokenAmount(100);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <AnimatePresence mode="wait">
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <DialogHeader>
                <DialogTitle className="font-display text-xl">
                  Invest in {business.name}
                </DialogTitle>
                <DialogDescription>
                  Purchase tokens to become a fractional owner and earn dividends
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                {/* Token Amount Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="tokenAmount">Token Amount</Label>
                    <Badge variant="outline">{ownershipPercentage.toFixed(2)}% ownership</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input
                      id="tokenAmount"
                      type="number"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(Math.min(maxTokens, Math.max(1, parseInt(e.target.value) || 0)))}
                      className="w-28 bg-secondary/50"
                    />
                    <Slider
                      value={[tokenAmount]}
                      onValueChange={([value]) => setTokenAmount(value)}
                      max={maxTokens}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Max: {maxTokens.toLocaleString()} tokens ({CONSTANTS.MAX_INVESTMENT_PERCENTAGE}% of supply)
                  </p>
                </div>

                {/* Investment Summary */}
                <div className="glass-card p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      Token Price
                    </span>
                    <span className="font-semibold">{business.tokenPrice} MNT</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tokens to Purchase</span>
                    <span className="font-semibold">{tokenAmount.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between items-center">
                    <span className="font-semibold">Total Cost</span>
                    <span className="font-display text-xl font-bold text-primary">
                      {totalCost.toFixed(4)} MNT
                    </span>
                  </div>
                </div>

                {/* Estimated Returns */}
                <div className="bg-success/10 rounded-lg p-4 flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium text-success">Estimated Annual Dividend</p>
                    <p className="text-2xl font-display font-bold">${estimatedAnnualDividend.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on current revenue and profit margin
                    </p>
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-warning/10 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Investment returns are not guaranteed. Past performance does not indicate future results.
                  </p>
                </div>

                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  onClick={() => setStep('confirm')}
                  disabled={tokenAmount <= 0 || tokenAmount > maxTokens}
                >
                  Review Investment
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DialogHeader>
                <DialogTitle className="font-display text-xl">
                  Confirm Investment
                </DialogTitle>
                <DialogDescription>
                  Review your investment details before confirming
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                <div className="glass-card p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Business</span>
                    <span className="font-semibold">{business.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tokens</span>
                    <span className="font-semibold">{tokenAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ownership</span>
                    <span className="font-semibold">{ownershipPercentage.toFixed(2)}%</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-display text-xl font-bold text-primary">
                      {totalCost.toFixed(4)} MNT
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep('input')}
                    disabled={isProcessing}
                  >
                    Back
                  </Button>
                  <Button
                    variant="gradient"
                    className="flex-1"
                    onClick={handleInvest}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Confirm Investment'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mb-4"
              >
                <CheckCircle className="h-8 w-8 text-success" />
              </motion.div>
              <h3 className="font-display text-2xl font-bold mb-2">Investment Successful!</h3>
              <p className="text-muted-foreground mb-6">
                You now own {tokenAmount.toLocaleString()} tokens of {business.name}
              </p>
              <Button variant="gradient" onClick={handleClose}>
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
