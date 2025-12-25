export interface Business {
  id: number;
  name: string;
  description: string;
  category: string;
  owner: string;
  tokenAddress: string;
  tokenSupply: number;
  tokenPrice: number;
  availableTokens: number;
  monthlyRevenue: number;
  profitMargin: number;
  totalDividendsPaid: number;
  isVerified: boolean;
  isActive: boolean;
  imageUrl?: string;
  createdAt?: Date;
}

export interface Investment {
  businessId: number;
  businessName: string;
  tokenBalance: number;
  investedAmount: number;
  currentValue: number;
  claimableDividends: number;
  totalDividendsClaimed: number;
}

export interface PlatformStats {
  totalBusinesses: number;
  totalInvestmentVolume: number;
  totalDividendsPaid: number;
  totalInvestors: number;
}

export interface Transaction {
  id: string;
  type: 'investment' | 'dividend_claim' | 'dividend_distribution';
  businessId: number;
  businessName: string;
  amount: number;
  tokenAmount?: number;
  timestamp: Date;
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface CreateBusinessForm {
  name: string;
  description: string;
  category: string;
  tokenSupply: number;
  tokenPrice: number;
  monthlyRevenue: number;
  profitMargin: number;
}
