import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true
    }
  },
  defaultNetwork: "mantleSepolia",
  networks: {
    mantle: {
      url: "https://rpc.mantle.xyz",
      accounts: [process.env.PRIVATE_KEY!],
    },
    mantleSepolia: {
      url: "https://rpc.sepolia.mantle.xyz",
      accounts: [process.env.PRIVATE_KEY!],
    },
    mantleTestnet: {
      url: process.env.MANTLE_TESTNET_RPC_URL,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    customChains: [
      {
        network: "mantle",
        chainId: Number(process.env.MANTLE_MAINNET_CHAIN_ID),
        urls: {
          apiURL: `${process.env.MANTLE_MAINNET_EXPLORER}api`,
          browserURL: process.env.MANTLE_MAINNET_EXPLORER!,
        },
      },
      {
        network: "mantleTestnet",
        chainId: Number(process.env.MANTLE_TESTNET_CHAIN_ID),
        urls: {
          apiURL: `${process.env.MANTLE_TESTNET_EXPLORER}api`,
          browserURL: process.env.MANTLE_TESTNET_EXPLORER!,
        },
      },
    ],
  },
};

export default config;
