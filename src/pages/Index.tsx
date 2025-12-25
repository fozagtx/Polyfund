import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { PlatformStats } from '@/components/stats';
import { BusinessCard } from '@/components/business';
import { OrbitVisualization } from '@/components/hero';
import { GradientButton } from '@/components/ui/gradient-button';
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

  // Partner logos
  const partners = ['Dreamure', 'SWITCH.WIN', 'Sphere', 'PinSpace', 'Visionix'];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-peach/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-lavender/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-violet/20 rounded-full blur-[150px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Hero container with rounded corners */}
          <div className="hero-container p-8 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left content */}
              <div className="text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary">Built on Mantle Network</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-[1.1] tracking-tight"
                >
                  Unlock Top Business{' '}
                  <span className="text-foreground">Investment</span>{' '}
                  <span className="text-foreground">You Thought Was</span>{' '}
                  <span className="text-foreground">Out of Reach –</span>
                  <br />
                  <span className="gradient-text-peach">Now Just One</span>{' '}
                  <span className="gradient-text-peach">Click Away!</span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-start gap-4 mt-8"
                >
                  <Link to="/businesses">
                    <GradientButton className="gap-2 text-base">
                      Start Investing
                      <ArrowRight className="h-5 w-5" />
                    </GradientButton>
                  </Link>
                </motion.div>

                {/* Social proof badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="inline-flex items-center gap-2 mt-8"
                >
                  <div className="relative">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <div className="absolute inset-0 w-2 h-2 bg-success rounded-full animate-ping" />
                  </div>
                  <span className="text-sm text-muted-foreground">Live on Mantle</span>
                </motion.div>
              </div>

              {/* Right content - Orbit visualization */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <OrbitVisualization 
                  centerValue={`${mockPlatformStats.totalBusinesses}+`}
                  centerLabel="Businesses"
                />
              </motion.div>
            </div>

            {/* Partner logos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-16 pt-8 border-t border-border/20"
            >
              <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
                {partners.map((partner) => (
                  <span 
                    key={partner} 
                    className="text-muted-foreground/50 text-sm font-medium tracking-wider"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
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
            <h2 className="font-sans text-3xl font-bold mb-4">
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
                <h3 className="font-sans font-semibold mb-2">{feature.title}</h3>
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
              <h2 className="font-sans text-3xl font-bold mb-2">
                Featured <span className="gradient-text">Businesses</span>
              </h2>
              <p className="text-muted-foreground">
                Verified businesses ready for investment
              </p>
            </div>
            <Link to="/businesses">
              <GradientButton variant="variant" className="gap-2 min-w-0 px-6 py-3">
                View All <ArrowRight className="h-4 w-4" />
              </GradientButton>
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
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-lavender/10" />
            
            <div className="relative z-10">
              <h2 className="font-sans text-3xl lg:text-4xl font-bold mb-4">
                Ready to Start Investing?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Connect your wallet and start building your portfolio of 
                tokenized real-world businesses today.
              </p>
              <Link to="/businesses">
                <GradientButton className="gap-2 text-base">
                  Get Started <ArrowRight className="h-5 w-5" />
                </GradientButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
