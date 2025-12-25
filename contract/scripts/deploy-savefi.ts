import { ethers } from "hardhat";
import { SaveFinanceMVP } from "../typechain-types";

async function main() {
  console.log("🚀 Deploying SaveFinance MVP...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with the account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH");

  // Deploy SaveFinanceMVP contract
  console.log("\n📦 Deploying SaveFinanceMVP contract...");
  const SaveFinanceMVP = await ethers.getContractFactory("SaveFinanceMVP");
  const saveFinance: SaveFinanceMVP = await SaveFinanceMVP.deploy();

  console.log("⏳ Waiting for deployment...");
  await saveFinance.deployed();

  console.log("✅ SaveFinanceMVP deployed to:", saveFinance.address);

  // Verify deployment by calling a view function
  try {
    const stats = await saveFinance.getTotalStats();
    console.log("📊 Initial contract stats:");
    console.log("  - Total Savings:", ethers.utils.formatEther(stats.totalSavingsAmount), "ETH");
    console.log("  - Total Businesses:", stats.totalBusinesses.toString());
    console.log("  - Contract Balance:", ethers.utils.formatEther(stats.contractBalance), "ETH");
  } catch (error) {
    console.log("⚠️  Error reading contract stats:", error);
  }

  // Send some ETH to contract for yield payments (optional)
  const seedAmount = ethers.utils.parseEther("0.1");
  console.log(`\n💸 Seeding contract with ${ethers.utils.formatEther(seedAmount)} ETH for yield payments...`);

  try {
    const tx = await deployer.sendTransaction({
      to: saveFinance.address,
      value: seedAmount
    });
    await tx.wait();
    console.log("✅ Contract seeded successfully");
  } catch (error) {
    console.log("⚠️  Error seeding contract:", error);
  }

  // Display deployment summary
  console.log("\n🎉 DEPLOYMENT COMPLETE!");
  console.log("=" * 50);
  console.log("📋 Contract Details:");
  console.log("  SaveFinanceMVP Address:", saveFinance.address);
  console.log("  Deployer Address:", deployer.address);
  console.log("  Network:", process.env.HARDHAT_NETWORK || "localhost");
  console.log("  Transaction Hash:", saveFinance.deployTransaction.hash);

  console.log("\n🔗 Verification Command:");
  console.log(`npx hardhat verify --network ${process.env.HARDHAT_NETWORK || "localhost"} ${saveFinance.address}`);

  console.log("\n📖 Usage Examples:");
  console.log("1. Deposit ETH for savings:");
  console.log(`   saveFinance.deposit({ value: ethers.utils.parseEther("1.0") })`);

  console.log("\n2. Create a business:");
  console.log(`   saveFinance.createBusiness("My Business", "Description", 10000, ethers.utils.parseEther("0.01"))`);

  console.log("\n3. Purchase business tokens:");
  console.log(`   saveFinance.purchaseBusinessTokens(0, 100, { value: ethers.utils.parseEther("1.0") })`);

  console.log("\n4. Check savings balance:");
  console.log(`   saveFinance.getUserBalance(userAddress)`);

  console.log("\n5. Withdraw savings:");
  console.log(`   saveFinance.withdraw(ethers.utils.parseEther("0.5")) // or withdraw(0) for all`);

  return {
    saveFinanceMVP: saveFinance.address,
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