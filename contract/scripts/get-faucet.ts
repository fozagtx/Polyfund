import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

/**
 * Mantle Sepolia Faucet Script
 * Gets MNT tokens from various faucet sources
 */

interface FaucetResult {
  success: boolean;
  message: string;
  txHash?: string;
  amount?: string;
}

class MantleFaucet {
  private wallet: ethers.Wallet;
  private provider: ethers.providers.JsonRpcProvider;

  constructor() {
    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY not found in .env file");
    }

    this.provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.sepolia.mantle.xyz"
    );
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, this.provider);
  }

  async getBalance(): Promise<string> {
    const balance = await this.provider.getBalance(this.wallet.address);
    return ethers.utils.formatEther(balance);
  }

  async checkSepoliaETH(): Promise<boolean> {
    const sepoliaProvider = new ethers.providers.JsonRpcProvider(
      "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    );

    try {
      const balance = await sepoliaProvider.getBalance(this.wallet.address);
      const ethBalance = parseFloat(ethers.utils.formatEther(balance));

      console.log(`💰 Sepolia ETH Balance: ${ethBalance} ETH`);

      if (ethBalance < 0.001) {
        console.log("⚠️  You need Sepolia ETH for gas fees!");
        console.log("🔗 Get Sepolia ETH from: https://faucet.quicknode.com/ethereum/sepolia");
        return false;
      }

      return true;
    } catch (error) {
      console.log("⚠️  Could not check Sepolia ETH balance");
      return false;
    }
  }

  async displayFaucetOptions(): Promise<void> {
    console.log("🚰 Available Mantle Sepolia Faucets:");
    console.log("");
    console.log("1. 🌐 Official Mantle Faucet (Web Only)");
    console.log("   URL: https://faucet.sepolia.mantle.xyz/");
    console.log("   Requirements: Twitter authentication");
    console.log("   Amount: Variable");
    console.log("");
    console.log("2. ⚡ QuickNode Faucet");
    console.log("   URL: https://faucet.quicknode.com/mantle/sepolia");
    console.log("   Requirements: ≥0.001 ETH on Ethereum Mainnet");
    console.log("   Amount: 0.1 MNT");
    console.log("   Rate Limit: Once every 12 hours");
    console.log("");
    console.log("3. 🔗 Chainlink Faucet (LINK tokens)");
    console.log("   URL: https://faucets.chain.link/mantle-sepolia");
    console.log("   Amount: 25 LINK");
    console.log("");
  }

  async openFaucetInBrowser(): Promise<void> {
    const urls = [
      "https://faucet.sepolia.mantle.xyz/",
      "https://faucet.quicknode.com/mantle/sepolia",
      "https://faucets.chain.link/mantle-sepolia"
    ];

    console.log("🌐 Opening faucet URLs...");

    for (const url of urls) {
      try {
        // For different operating systems
        const { exec } = require('child_process');
        const platform = process.platform;

        let command: string;
        if (platform === 'darwin') {
          command = `open "${url}"`;
        } else if (platform === 'win32') {
          command = `start "" "${url}"`;
        } else {
          command = `xdg-open "${url}"`;
        }

        exec(command, (error: any) => {
          if (error) {
            console.log(`Could not open ${url} automatically`);
          }
        });

        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.log(`Manual link: ${url}`);
      }
    }
  }

  async showNetworkInfo(): Promise<void> {
    console.log("📡 Mantle Sepolia Network Info:");
    console.log("RPC URL: https://rpc.sepolia.mantle.xyz");
    console.log("Chain ID: 5003");
    console.log("Explorer: https://sepolia.mantlescan.xyz/");
    console.log("Symbol: MNT");
    console.log("");
  }

  async main(): Promise<void> {
    console.log("🚰 Mantle Sepolia Faucet Helper");
    console.log("================================");
    console.log("");
    console.log(`📍 Your Address: ${this.wallet.address}`);

    try {
      const balance = await this.getBalance();
      console.log(`💰 Current MNT Balance: ${balance} MNT`);
      console.log("");

      // Check if user has Sepolia ETH for gas
      await this.checkSepoliaETH();
      console.log("");

      // Show network info
      await this.showNetworkInfo();

      // Display faucet options
      await this.displayFaucetOptions();

      console.log("🤖 Actions:");
      console.log("1. Opening faucet websites in browser...");
      console.log("2. Add your address to each faucet");
      console.log("3. Follow their specific requirements");
      console.log("");

      // Open faucets in browser
      await this.openFaucetInBrowser();

      console.log("✅ Faucet URLs opened!");
      console.log("");
      console.log("📝 Manual Steps:");
      console.log("1. Visit opened faucet websites");
      console.log("2. Connect wallet or enter address:");
      console.log(`   ${this.wallet.address}`);
      console.log("3. Complete authentication (Twitter for official faucet)");
      console.log("4. Request tokens");
      console.log("5. Wait for transaction confirmation");
      console.log("");
      console.log("🔄 Run this script again to check updated balance");

    } catch (error) {
      console.error("❌ Error:", error);
    }
  }
}

// Execute the faucet helper
async function main() {
  try {
    const faucet = new MantleFaucet();
    await faucet.main();
  } catch (error) {
    console.error("❌ Error initializing faucet helper:", error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("❌ Unexpected error:", error);
  process.exitCode = 1;
});