import { ethers } from "hardhat";
import { Polyfunds } from "../typechain-types";

async function main() {
  console.log("🚀 Deploying Polyfunds - RWA Business Investment Platform...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH");

  // Deploy Polyfunds contract
  console.log("\n📦 Deploying Polyfunds contract...");
  const Polyfunds = await ethers.getContractFactory("Polyfunds");
  const polyfunds: Polyfunds = await Polyfunds.deploy();

  console.log("⏳ Waiting for deployment...");
  await polyfunds.deployed();

  console.log("✅ Polyfunds deployed to:", polyfunds.address);

  // Verify deployment by calling a view function
  try {
    const stats = await polyfunds.getPlatformStats();
    console.log("📊 Initial platform stats:");
    console.log("  - Total Businesses:", stats.totalBusinessesCount.toString());
    console.log("  - Total Investment Volume:", ethers.utils.formatEther(stats.totalInvestmentVolumeAmount), "ETH");
    console.log("  - Total Dividends Paid:", ethers.utils.formatEther(stats.totalDividendsPaidAmount), "ETH");
    console.log("  - Contract Balance:", ethers.utils.formatEther(stats.contractBalance), "ETH");
  } catch (error) {
    console.log("⚠️  Error reading platform stats:", error);
  }

  // Display deployment summary
  console.log("\n🎉 POLYFUNDS DEPLOYMENT COMPLETE!");
  console.log("=" .repeat(50));
  console.log("📋 Contract Details:");
  console.log("  Polyfunds Address:", polyfunds.address);
  console.log("  Deployer Address:", deployer.address);
  console.log("  Network:", process.env.HARDHAT_NETWORK || "localhost");
  console.log("  Transaction Hash:", polyfunds.deployTransaction.hash);

  console.log("\n🔗 Verification Command:");
  console.log(`npx hardhat verify --network ${process.env.HARDHAT_NETWORK || "localhost"} ${polyfunds.address}`);

  console.log("\n📖 POLYFUNDS USAGE GUIDE:");
  console.log("\n🏢 1. Create a Business:");
  console.log(`   polyfunds.createBusiness(`);
  console.log(`     "My Restaurant",`);
  console.log(`     "Local family restaurant serving authentic cuisine",`);
  console.log(`     "Food & Beverage",`);
  console.log(`     10000,  // 10,000 tokens`);
  console.log(`     ethers.utils.parseEther("0.01"),  // 0.01 ETH per token`);
  console.log(`     ethers.utils.parseEther("5"),     // 5 ETH monthly revenue`);
  console.log(`     25      // 25% profit margin`);
  console.log(`   )`);

  console.log("\n✅ 2. Verify Business (Admin only):");
  console.log(`   polyfunds.verifyBusiness(0, true)`);

  console.log("\n💰 3. Invest in Business:");
  console.log(`   polyfunds.investInBusiness(0, 100, { value: ethers.utils.parseEther("1") })`);
  console.log(`   // Buy 100 tokens for 1 ETH`);

  console.log("\n📈 4. Distribute Dividends (Business Owner):");
  console.log(`   polyfunds.distributeDividends(0, { value: ethers.utils.parseEther("0.5") })`);
  console.log(`   // Distribute 0.5 ETH to investors`);

  console.log("\n💎 5. Claim Dividends (Investor):");
  console.log(`   const businessToken = await ethers.getContractAt("BusinessToken", tokenAddress);`);
  console.log(`   businessToken.claimDividends()`);

  console.log("\n📊 6. View Business Info:");
  console.log(`   polyfunds.getBusinessInfo(businessId)`);

  console.log("\n🔍 7. Check Investments:");
  console.log(`   polyfunds.getUserInvestments(userAddress)`);
  console.log(`   polyfunds.getUserBusinessTokens(userAddress, businessId)`);

  console.log("\n💡 8. Calculate Potential Returns:");
  console.log(`   polyfunds.calculatePotentialDividend(businessId, tokenAmount)`);

  console.log("\n🎯 KEY FEATURES:");
  console.log("  ✅ Real World Asset tokenization");
  console.log("  ✅ Fractional business ownership");
  console.log("  ✅ Automated dividend distribution");
  console.log("  ✅ 25% max investment limit per business");
  console.log("  ✅ 3% platform fee");
  console.log("  ✅ Admin verification required");
  console.log("  ✅ Business financial metrics tracking");

  console.log("\n⚠️  IMPORTANT NOTES:");
  console.log("  • Businesses must be verified before investments");
  console.log("  • Maximum 25% ownership per investor per business");
  console.log("  • 3% platform fee on all investments");
  console.log("  • Business owners can update financial metrics");
  console.log("  • Dividends distributed to token holders proportionally");

  return {
    polyfunds: polyfunds.address,
    deployer: deployer.address,
    network: process.env.HARDHAT_NETWORK || "localhost"
  };
}

// Execute deployment
main()
  .then((result) => {
    console.log("\n✨ Deployment result:", result);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });