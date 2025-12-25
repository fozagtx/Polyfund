import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout';
import { BusinessFilters, BusinessGrid } from '@/components/business';
import { mockBusinesses } from '@/data/mockData';

const Businesses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const filteredBusinesses = useMemo(() => {
    return mockBusinesses.filter((business) => {
      const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || business.category === selectedCategory;
      const matchesVerified = !showVerifiedOnly || business.isVerified;
      const isActive = business.isActive;

      return matchesSearch && matchesCategory && matchesVerified && isActive;
    });
  }, [searchTerm, selectedCategory, showVerifiedOnly]);

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
            <h1 className="font-display text-4xl font-bold mb-4">
              Explore <span className="gradient-text">Businesses</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Discover verified businesses ready for fractional investment. 
              Each token represents ownership and dividend rights.
            </p>
          </motion.div>

          {/* Filters */}
          <BusinessFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            showVerifiedOnly={showVerifiedOnly}
            onVerifiedChange={setShowVerifiedOnly}
          />

          {/* Results count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground mb-6"
          >
            Showing {filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? 'es' : ''}
          </motion.p>

          {/* Grid */}
          <BusinessGrid businesses={filteredBusinesses} />
        </div>
      </section>
    </Layout>
  );
};

export default Businesses;
