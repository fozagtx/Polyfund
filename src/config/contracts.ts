// Contract addresses - Replace with actual deployed addresses
export const POLYFUNDS_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

// Platform constants
export const CONSTANTS = {
  MIN_TOKEN_SUPPLY: 1000,
  MAX_TOKEN_SUPPLY: 1000000,
  MIN_TOKEN_PRICE: '0.001', // ETH/MNT
  MAX_INVESTMENT_PERCENTAGE: 25,
  PLATFORM_FEE: 3, // percent
} as const;

// Business categories
export const BUSINESS_CATEGORIES = [
  'Technology',
  'Real Estate',
  'Healthcare',
  'Finance',
  'Retail',
  'Manufacturing',
  'Food & Beverage',
  'Energy',
  'Entertainment',
  'Transportation',
] as const;

export type BusinessCategory = typeof BUSINESS_CATEGORIES[number];

// Contract ABI (simplified for demo - replace with actual ABI)
export const POLYFUNDS_ABI = [
  {
    name: 'createBusiness',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'category', type: 'string' },
      { name: 'tokenSupply', type: 'uint256' },
      { name: 'tokenPrice', type: 'uint256' },
      { name: 'monthlyRevenue', type: 'uint256' },
      { name: 'profitMargin', type: 'uint256' },
    ],
    outputs: [{ name: 'businessId', type: 'uint256' }],
  },
  {
    name: 'investInBusiness',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'businessId', type: 'uint256' },
      { name: 'tokenAmount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'distributeDividends',
    type: 'function',
    stateMutability: 'payable',
    inputs: [{ name: 'businessId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'getBusinessInfo',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'businessId', type: 'uint256' }],
    outputs: [
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'category', type: 'string' },
      { name: 'owner', type: 'address' },
      { name: 'tokenAddress', type: 'address' },
      { name: 'tokenSupply', type: 'uint256' },
      { name: 'tokenPrice', type: 'uint256' },
      { name: 'availableTokens', type: 'uint256' },
      { name: 'monthlyRevenue', type: 'uint256' },
      { name: 'profitMargin', type: 'uint256' },
      { name: 'totalDividendsPaid', type: 'uint256' },
      { name: 'isVerified', type: 'bool' },
      { name: 'isActive', type: 'bool' },
    ],
  },
  {
    name: 'getUserInvestments',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: 'businessIds', type: 'uint256[]' }],
  },
  {
    name: 'getPlatformStats',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'totalBusinesses', type: 'uint256' },
      { name: 'totalInvestmentVolume', type: 'uint256' },
      { name: 'totalDividendsPaid', type: 'uint256' },
      { name: 'totalInvestors', type: 'uint256' },
    ],
  },
  {
    name: 'businessCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export const BUSINESS_TOKEN_ABI = [
  {
    name: 'claimDividends',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'getClaimableDividends',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'holder', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;
