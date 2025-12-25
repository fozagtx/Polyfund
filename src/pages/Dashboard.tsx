import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Layout } from '@/components/layout';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Wallet, 
  Plus,
  Building2,
  DollarSign,
  Coins,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { BUSINESS_CATEGORIES, CONSTANTS } from '@/config/contracts';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { isConnected } = useAccount();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tokenSupply: 10000,
    tokenPrice: 0.01,
    monthlyRevenue: 10000,
    profitMargin: 20,
  });

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
                Connect your wallet to create and manage your tokenized businesses.
              </p>
              <ConnectButton />
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.description || !formData.category) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (formData.tokenSupply < CONSTANTS.MIN_TOKEN_SUPPLY || formData.tokenSupply > CONSTANTS.MAX_TOKEN_SUPPLY) {
      toast({
        title: 'Invalid token supply',
        description: `Token supply must be between ${CONSTANTS.MIN_TOKEN_SUPPLY} and ${CONSTANTS.MAX_TOKEN_SUPPLY}`,
        variant: 'destructive',
      });
      return;
    }

    if (formData.tokenPrice < Number(CONSTANTS.MIN_TOKEN_PRICE)) {
      toast({
        title: 'Invalid token price',
        description: `Token price must be at least ${CONSTANTS.MIN_TOKEN_PRICE} MNT`,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: 'Business created!',
      description: 'Your business has been tokenized and is pending verification.',
    });
    
    setIsSubmitting(false);
    setFormData({
      name: '',
      description: '',
      category: '',
      tokenSupply: 10000,
      tokenPrice: 0.01,
      monthlyRevenue: 10000,
      profitMargin: 20,
    });
  };

  const estimatedMarketCap = formData.tokenSupply * formData.tokenPrice;
  const estimatedAnnualDividend = (formData.monthlyRevenue * 12 * (formData.profitMargin / 100));

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-4xl font-bold mb-2">
              Business <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Create and manage your tokenized businesses
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Business Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <GlassCard>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="font-display text-xl font-semibold">Create New Business</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="name">Business Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter business name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-secondary/50 mt-1"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your business..."
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-secondary/50 mt-1 min-h-24"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className="bg-secondary/50 mt-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUSINESS_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Token Settings */}
                  <div className="border-t border-border/50 pt-6">
                    <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                      <Coins className="h-5 w-5 text-primary" />
                      Token Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tokenSupply">Token Supply</Label>
                        <Input
                          id="tokenSupply"
                          type="number"
                          min={CONSTANTS.MIN_TOKEN_SUPPLY}
                          max={CONSTANTS.MAX_TOKEN_SUPPLY}
                          value={formData.tokenSupply}
                          onChange={(e) => setFormData(prev => ({ ...prev, tokenSupply: parseInt(e.target.value) || 0 }))}
                          className="bg-secondary/50 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Min: {CONSTANTS.MIN_TOKEN_SUPPLY.toLocaleString()} | Max: {CONSTANTS.MAX_TOKEN_SUPPLY.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="tokenPrice">Token Price (MNT)</Label>
                        <Input
                          id="tokenPrice"
                          type="number"
                          step="0.001"
                          min={CONSTANTS.MIN_TOKEN_PRICE}
                          value={formData.tokenPrice}
                          onChange={(e) => setFormData(prev => ({ ...prev, tokenPrice: parseFloat(e.target.value) || 0 }))}
                          className="bg-secondary/50 mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Min: {CONSTANTS.MIN_TOKEN_PRICE} MNT
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Info */}
                  <div className="border-t border-border/50 pt-6">
                    <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Financial Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="monthlyRevenue">Monthly Revenue (USD)</Label>
                        <Input
                          id="monthlyRevenue"
                          type="number"
                          min="0"
                          value={formData.monthlyRevenue}
                          onChange={(e) => setFormData(prev => ({ ...prev, monthlyRevenue: parseInt(e.target.value) || 0 }))}
                          className="bg-secondary/50 mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="profitMargin">Profit Margin (%)</Label>
                        <Input
                          id="profitMargin"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.profitMargin}
                          onChange={(e) => setFormData(prev => ({ ...prev, profitMargin: parseInt(e.target.value) || 0 }))}
                          className="bg-secondary/50 mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10">
                    <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-warning">Verification Required</p>
                      <p className="text-muted-foreground">
                        Your business will undergo verification before investors can purchase tokens. 
                        A {CONSTANTS.PLATFORM_FEE}% platform fee applies to all investments.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Business'}
                  </Button>
                </form>
              </GlassCard>
            </motion.div>

            {/* Preview / Stats Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Preview */}
              <GlassCard>
                <h3 className="font-display font-semibold mb-4">Token Preview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Market Cap</span>
                    <span className="font-semibold">{estimatedMarketCap.toFixed(2)} MNT</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Est. Annual Dividends</span>
                    <span className="font-semibold text-success">${estimatedAnnualDividend.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span className="font-semibold">{CONSTANTS.PLATFORM_FEE}%</span>
                  </div>
                </div>
              </GlassCard>

              {/* Quick Stats */}
              <GlassCard>
                <h3 className="font-display font-semibold mb-4">Your Businesses</h3>
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/50 mb-3">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No businesses yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create your first tokenized business above
                  </p>
                </div>
              </GlassCard>

              {/* Steps */}
              <GlassCard>
                <h3 className="font-display font-semibold mb-4">How It Works</h3>
                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Create Business', desc: 'Fill in your business details' },
                    { step: 2, title: 'Get Verified', desc: 'Our team reviews your submission' },
                    { step: 3, title: 'Token Sale', desc: 'Investors can purchase your tokens' },
                    { step: 4, title: 'Distribute Dividends', desc: 'Share profits with token holders' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
