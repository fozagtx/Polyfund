import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import { BUSINESS_CATEGORIES } from '@/config/contracts';

interface BusinessFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  showVerifiedOnly: boolean;
  onVerifiedChange: (value: boolean) => void;
}

export function BusinessFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  showVerifiedOnly,
  onVerifiedChange,
}: BusinessFiltersProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const displayedCategories = showAllCategories ? BUSINESS_CATEGORIES : BUSINESS_CATEGORIES.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-8"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Verified Filter */}
        <Button
          variant={showVerifiedOnly ? 'default' : 'outline'}
          onClick={() => onVerifiedChange(!showVerifiedOnly)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Verified Only
        </Button>
      </div>

      {/* Categories */}
      <div className="mt-4">
        <p className="text-sm text-muted-foreground mb-2">Categories</p>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary/80"
            onClick={() => onCategoryChange(null)}
          >
            All
          </Badge>
          {displayedCategories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/80"
              onClick={() => onCategoryChange(category === selectedCategory ? null : category)}
            >
              {category}
            </Badge>
          ))}
          {!showAllCategories && BUSINESS_CATEGORIES.length > 5 && (
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-secondary"
              onClick={() => setShowAllCategories(true)}
            >
              +{BUSINESS_CATEGORIES.length - 5} more
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}
