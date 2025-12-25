import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

// Mantle chain configuration
export const mantle = {
  id: 5000,
  name: 'Mantle',
  nativeCurrency: {
    decimals: 18,
    name: 'MNT',
    symbol: 'MNT',
  },
  rpcUrls: {
    default: { http: ['https://rpc.mantle.xyz'] },
    public: { http: ['https://rpc.mantle.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Mantle Explorer', url: 'https://explorer.mantle.xyz' },
  },
} as const;

export const mantleTestnet = {
  id: 5003,
  name: 'Mantle Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'MNT',
    symbol: 'MNT',
  },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia.mantle.xyz'] },
    public: { http: ['https://rpc.sepolia.mantle.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Mantle Sepolia Explorer', url: 'https://explorer.sepolia.mantle.xyz' },
  },
  testnet: true,
} as const;

export const config = getDefaultConfig({
  appName: 'Polyfunds',
  projectId: 'polyfunds-demo', // Replace with actual WalletConnect project ID
  chains: [mantle, mantleTestnet, mainnet, sepolia],
  transports: {
    [mantle.id]: http(),
    [mantleTestnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
