import { Business } from '@/types';
import { BusinessCard } from './BusinessCard';

interface BusinessGridProps {
  businesses: Business[];
}

export function BusinessGrid({ businesses }: BusinessGridProps) {
  if (businesses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
          <span className="text-3xl">🏢</span>
        </div>
        <h3 className="font-display text-xl font-semibold mb-2">No businesses found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business, index) => (
        <BusinessCard
          key={business.id}
          business={business}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}
