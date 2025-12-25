import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";

/**
 * Generate a new Ethereum wallet with private key for deployment
 * WARNING: Keep your private key secure and never commit it to version control
 */
async function generateWallet() {
  console.log("🔐 Generating new Ethereum wallet...\n");

  // Generate random wallet
  const wallet = ethers.Wallet.createRandom();

  console.log("✅ New wallet generated successfully!");
  console.log("📍 Address:", wallet.address);
  console.log("🔑 Private Key:", wallet.privateKey);
  console.log("🎲 Mnemonic:", wallet.mnemonic?.phrase);

  console.log("\n⚠️  SECURITY WARNING:");
  console.log("- Keep your private key secure and never share it");
  console.log("- Never commit your private key to version control");
  console.log("- Fund this address with MNT tokens before deployment");

  // Update .env file
  const envPath = path.join(__dirname, "../.env");
  const envExamplePath = path.join(__dirname, "../.env.example");

  let envContent = "";

  // Read existing .env or use .env.example as template
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
    // Replace existing PRIVATE_KEY
    envContent = envContent.replace(
      /^PRIVATE_KEY=.*/m,
      `PRIVATE_KEY=${wallet.privateKey}`
    );
  } else if (fs.existsSync(envExamplePath)) {
    envContent = fs.readFileSync(envExamplePath, "utf8");
    envContent = envContent.replace(
      /^PRIVATE_KEY=\[YOUR_PRIVATE_KEY\]/m,
      `PRIVATE_KEY=${wallet.privateKey}`
    );
  } else {
    // Create basic .env content
    envContent = `PRIVATE_KEY=${wallet.privateKey}\nETHERSCAN_API_KEY=[YOUR_API_KEY]\n`;
  }

  // Write updated .env file
  fs.writeFileSync(envPath, envContent);
  console.log("\n✅ Updated .env file with new private key");

  console.log("\n📝 Next steps:");
  console.log("1. Fund your address with MNT tokens:");
  console.log(`   Address: ${wallet.address}`);
  console.log("2. Get MNT from faucet (testnet) or exchange (mainnet)");
  console.log("3. Test deployment with: npm run deploy");
  console.log("\n🔒 Backup your mnemonic phrase securely!");
}

// Main execution
generateWallet().catch((error) => {
  console.error("❌ Error generating wallet:", error);
  process.exitCode = 1;
});