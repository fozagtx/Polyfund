import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout';
import { PlatformStats } from '@/components/stats';
import { BusinessCard } from '@/components/business';
import { mockBusinesses, mockPlatformStats } from '@/data/mockData';
import { 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Zap,
  Coins,
  Building2,
  Users
} from 'lucide-react';

const Index = () => {
  const featuredBusinesses = mockBusinesses.filter(b => b.isVerified).slice(0, 3);

  const features = [
    {
      icon: Building2,
      title: 'Tokenized Businesses',
      description: 'Invest in real businesses with blockchain-backed fractional ownership tokens.',
    },
    {
      icon: Coins,
      title: 'Dividend Distribution',
      description: 'Earn proportional dividends based on your token holdings automatically.',
    },
    {
      icon: Shield,
      title: 'Verified & Secure',
      description: 'All businesses undergo verification. Smart contracts ensure transparency.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join thousands of investors building diversified real-asset portfolios.',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="mb-6 gap-2 px-4 py-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Built on Mantle Network
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              Invest in Real Businesses.{' '}
              <span className="gradient-text">Earn Real Dividends.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Polyfunds enables fractional ownership of verified businesses through 
              blockchain technology. Buy tokens, earn dividends, build wealth.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/businesses">
                <Button variant="gradient" size="xl" className="gap-2">
                  Explore Businesses
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="xl" className="gap-2">
                  <Zap className="h-5 w-5" />
                  List Your Business
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
          >
            <div className="w-1 h-2 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* Platform Stats */}
      <PlatformStats stats={mockPlatformStats} />

      {/* Features Section */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold mb-4">
              Why <span className="gradient-text">Polyfunds</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A new way to invest in businesses you believe in
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card-hover p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
          >
            <div>
              <h2 className="font-display text-3xl font-bold mb-2">
                Featured <span className="gradient-text">Businesses</span>
              </h2>
              <p className="text-muted-foreground">
                Verified businesses ready for investment
              </p>
            </div>
            <Link to="/businesses">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBusinesses.map((business, index) => (
              <BusinessCard
                key={business.id}
                business={business}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative glass-card p-8 lg:p-12 text-center overflow-hidden"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            
            <div className="relative z-10">
              <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
                Ready to Start Investing?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Connect your wallet and start building your portfolio of 
                tokenized real-world businesses today.
              </p>
              <Link to="/businesses">
                <Button variant="gradient" size="xl" className="gap-2">
                  Get Started <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
