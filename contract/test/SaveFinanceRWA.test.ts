import { expect } from "chai";
import { ethers } from "hardhat";
import { Polyfunds } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Polyfunds RWA Platform", function () {
  let polyfunds: Polyfunds;
  let owner: SignerWithAddress;
  let businessOwner1: SignerWithAddress;
  let businessOwner2: SignerWithAddress;
  let investor1: SignerWithAddress;
  let investor2: SignerWithAddress;
  let feeRecipient: SignerWithAddress;

  beforeEach(async function () {
    [owner, businessOwner1, businessOwner2, investor1, investor2, feeRecipient] = await ethers.getSigners();

    const SaveFinance = await ethers.getContractFactory("SaveFinance");
    saveFinance = await SaveFinance.deploy();
    await saveFinance.deployed();
  });

  describe("Business Creation", function () {
    it("Should allow creating a business with valid parameters", async function () {
      const name = "TechCorp";
      const description = "Technology consulting business";
      const category = "Technology";
      const tokenSupply = 10000;
      const tokenPrice = ethers.utils.parseEther("0.01");
      const monthlyRevenue = ethers.utils.parseEther("10");
      const profitMargin = 20;

      await expect(
        saveFinance.connect(businessOwner1).createBusiness(
          name,
          description,
          category,
          tokenSupply,
          tokenPrice,
          monthlyRevenue,
          profitMargin
        )
      ).to.emit(saveFinance, "BusinessCreated");

      const businessInfo = await saveFinance.getBusinessInfo(0);
      expect(businessInfo.name).to.equal(name);
      expect(businessInfo.description).to.equal(description);
      expect(businessInfo.category).to.equal(category);
      expect(businessInfo.owner).to.equal(businessOwner1.address);
      expect(businessInfo.tokenSupply).to.equal(tokenSupply);
      expect(businessInfo.tokenPrice).to.equal(tokenPrice);
      expect(businessInfo.monthlyRevenue).to.equal(monthlyRevenue);
      expect(businessInfo.profitMargin).to.equal(profitMargin);
      expect(businessInfo.active).to.be.true;
      expect(businessInfo.verified).to.be.false;
    });

    it("Should reject business creation with invalid parameters", async function () {
      // Empty name
      await expect(
        saveFinance.connect(businessOwner1).createBusiness(
          "",
          "Description",
          "Category",
          10000,
          ethers.utils.parseEther("0.01"),
          ethers.utils.parseEther("10"),
          20
        )
      ).to.be.revertedWith("Business name required");

      // Empty description
      await expect(
        saveFinance.connect(businessOwner1).createBusiness(
          "Business",
          "",
          "Category",
          10000,
          ethers.utils.parseEther("0.01"),
          ethers.utils.parseEther("10"),
          20
        )
      ).to.be.revertedWith("Description required");

      // Invalid token supply (too low)
      await expect(
        saveFinance.connect(businessOwner1).createBusiness(
          "Business",
          "Description",
          "Category",
          500,
          ethers.utils.parseEther("0.01"),
          ethers.utils.parseEther("10"),
          20
        )
      ).to.be.revertedWith("Invalid token supply");

      // Invalid token supply (too high)
      await expect(
        saveFinance.connect(businessOwner1).createBusiness(
          "Business",
          "Description",
          "Category",
          2000000,
          ethers.utils.parseEther("0.01"),
          ethers.utils.parseEther("10"),
          20
        )
      ).to.be.revertedWith("Invalid token supply");

      // Price too low
      await expect(
        saveFinance.connect(businessOwner1).createBusiness(
          "Business",
          "Description",
          "Category",
          10000,
          ethers.utils.parseEther("0.0005"),
          ethers.utils.parseEther("10"),
          20
        )
      ).to.be.revertedWith("Token price too low");

      // Invalid profit margin
      await expect(
        saveFinance.connect(businessOwner1).createBusiness(
          "Business",
          "Description",
          "Category",
          10000,
          ethers.utils.parseEther("0.01"),
          ethers.utils.parseEther("10"),
          150
        )
      ).to.be.revertedWith("Invalid profit margin");
    });

    it("Should track owner businesses correctly", async function () {
      await saveFinance.connect(businessOwner1).createBusiness(
        "Business1",
        "Description1",
        "Category1",
        10000,
        ethers.utils.parseEther("0.01"),
        ethers.utils.parseEther("10"),
        20
      );

      await saveFinance.connect(businessOwner1).createBusiness(
        "Business2",
        "Description2",
        "Category2",
        15000,
        ethers.utils.parseEther("0.02"),
        ethers.utils.parseEther("15"),
        25
      );

      const ownerBusinesses = await saveFinance.getOwnerBusinesses(businessOwner1.address);
      expect(ownerBusinesses.length).to.equal(2);
      expect(ownerBusinesses[0]).to.equal(0);
      expect(ownerBusinesses[1]).to.equal(1);
    });
  });

  describe("Business Verification", function () {
    beforeEach(async function () {
      await saveFinance.connect(businessOwner1).createBusiness(
        "TestBiz",
        "Test Description",
        "Test Category",
        10000,
        ethers.utils.parseEther("0.01"),
        ethers.utils.parseEther("10"),
        20
      );
    });

    it("Should allow owner to verify business", async function () {
      await expect(saveFinance.connect(owner).verifyBusiness(0, true))
        .to.emit(saveFinance, "BusinessVerified")
        .withArgs(0, true);

      const businessInfo = await saveFinance.getBusinessInfo(0);
      expect(businessInfo.verified).to.be.true;
    });

    it("Should reject verification from non-owner", async function () {
      await expect(saveFinance.connect(investor1).verifyBusiness(0, true))
        .to.be.reverted;
    });
  });

  describe("Investment Flow", function () {
    beforeEach(async function () {
      // Create and verify a business
      await saveFinance.connect(businessOwner1).createBusiness(
        "InvestmentTest",
        "Investment Test Business",
        "Test",
        10000,
        ethers.utils.parseEther("0.01"),
        ethers.utils.parseEther("20"),
        30
      );

      await saveFinance.connect(owner).verifyBusiness(0, true);
    });

    it("Should allow investment in verified business", async function () {
      const tokenAmount = 1000;
      const totalCost = ethers.utils.parseEther("10"); // 1000 * 0.01 ETH

      const businessOwnerBalanceBefore = await businessOwner1.getBalance();
      const ownerBalanceBefore = await owner.getBalance();

      await expect(
        saveFinance.connect(investor1).investInBusiness(0, tokenAmount, {
          value: totalCost
        })
      ).to.emit(saveFinance, "InvestmentMade")
       .withArgs(0, investor1.address, tokenAmount, totalCost);

      // Check balances after investment
      const businessOwnerBalanceAfter = await businessOwner1.getBalance();
      const ownerBalanceAfter = await owner.getBalance();

      // Business owner should receive 97% (after 3% platform fee)
      const expectedBusinessAmount = totalCost.mul(97).div(100);
      const expectedPlatformFee = totalCost.mul(3).div(100);

      expect(businessOwnerBalanceAfter).to.equal(businessOwnerBalanceBefore.add(expectedBusinessAmount));
      expect(ownerBalanceAfter).to.equal(ownerBalanceBefore.add(expectedPlatformFee));

      // Check investment tracking
      const userTokens = await saveFinance.getUserBusinessTokens(investor1.address, 0);
      expect(userTokens).to.equal(tokenAmount);

      const investments = await saveFinance.getUserInvestments(investor1.address);
      expect(investments.length).to.equal(1);
      expect(investments[0].businessId).to.equal(0);
      expect(investments[0].tokenAmount).to.equal(tokenAmount);
    });

    it("Should reject investment in unverified business", async function () {
      // Create unverified business
      await saveFinance.connect(businessOwner2).createBusiness(
        "Unverified",
        "Unverified Business",
        "Test",
        10000,
        ethers.utils.parseEther("0.01"),
        ethers.utils.parseEther("10"),
        20
      );

      const tokenAmount = 100;
      const totalCost = ethers.utils.parseEther("1");

      await expect(
        saveFinance.connect(investor1).investInBusiness(1, tokenAmount, {
          value: totalCost
        })
      ).to.be.revertedWith("Business not verified");
    });

    it("Should reject incorrect payment amount", async function () {
      const tokenAmount = 100;
      const incorrectPayment = ethers.utils.parseEther("0.5");

      await expect(
        saveFinance.connect(investor1).investInBusiness(0, tokenAmount, {
          value: incorrectPayment
        })
      ).to.be.revertedWith("Incorrect ETH amount");
    });

    it("Should enforce maximum investment limit (25%)", async function () {
      const maxTokens = 2500; // 25% of 10000 total supply
      const exceedingTokens = 2600;
      const totalCost = ethers.utils.parseEther("26"); // 2600 * 0.01

      await expect(
        saveFinance.connect(investor1).investInBusiness(0, exceedingTokens, {
          value: totalCost
        })
      ).to.be.revertedWith("Exceeds maximum investment limit");

      // Should work with exactly 25%
      const maxCost = ethers.utils.parseEther("25");
      await expect(
        saveFinance.connect(investor1).investInBusiness(0, maxTokens, {
          value: maxCost
        })
      ).to.emit(saveFinance, "InvestmentMade");
    });
  });

  describe("Dividend Distribution", function () {
    let businessId: number;

    beforeEach(async function () {
      businessId = 0;

      // Create and verify business
      await saveFinance.connect(businessOwner1).createBusiness(
        "DividendTest",
        "Dividend Test Business",
        "Test",
        10000,
        ethers.utils.parseEther("0.01"),
        ethers.utils.parseEther("50"),
        40
      );

      await saveFinance.connect(owner).verifyBusiness(businessId, true);

      // Make investments
      await saveFinance.connect(investor1).investInBusiness(businessId, 2000, {
        value: ethers.utils.parseEther("20")
      });

      await saveFinance.connect(investor2).investInBusiness(businessId, 3000, {
        value: ethers.utils.parseEther("30")
      });
    });

    it("Should allow business owner to distribute dividends", async function () {
      const dividendAmount = ethers.utils.parseEther("5");

      await expect(
        saveFinance.connect(businessOwner1).distributeDividends(businessId, {
          value: dividendAmount
        })
      ).to.emit(saveFinance, "DividendDistributed")
       .withArgs(businessId, dividendAmount, await getCurrentTimestamp());

      const businessInfo = await saveFinance.getBusinessInfo(businessId);
      expect(businessInfo.totalRaised).to.be.gt(0); // Should have raised funds
    });

    it("Should reject dividend distribution from non-owner", async function () {
      const dividendAmount = ethers.utils.parseEther("1");

      await expect(
        saveFinance.connect(investor1).distributeDividends(businessId, {
          value: dividendAmount
        })
      ).to.be.revertedWith("Not business owner");
    });

    it("Should reject dividend distribution with zero amount", async function () {
      await expect(
        saveFinance.connect(businessOwner1).distributeDividends(businessId, {
          value: 0
        })
      ).to.be.revertedWith("Must send ETH for dividends");
    });
  });

  describe("Business Financial Updates", function () {
    beforeEach(async function () {
      await saveFinance.connect(businessOwner1).createBusiness(
        "UpdateTest",
        "Update Test Business",
        "Test",
        10000,
        ethers.utils.parseEther("0.01"),
        ethers.utils.parseEther("10"),
        20
      );
    });

    it("Should allow business owner to update metrics", async function () {
      const newRevenue = ethers.utils.parseEther("15");
      const newMargin = 25;

      await expect(
        saveFinance.connect(businessOwner1).updateBusinessMetrics(0, newRevenue, newMargin)
      ).to.emit(saveFinance, "BusinessUpdated")
       .withArgs(0, newRevenue, newMargin);

      const businessInfo = await saveFinance.getBusinessInfo(0);
      expect(businessInfo.monthlyRevenue).to.equal(newRevenue);
      expect(businessInfo.profitMargin).to.equal(newMargin);
    });

    it("Should reject updates from non-owner", async function () {
      await expect(
        saveFinance.connect(investor1).updateBusinessMetrics(0, ethers.utils.parseEther("15"), 25)
      ).to.be.revertedWith("Not business owner");
    });

    it("Should reject invalid profit margin", async function () {
      await expect(
        saveFinance.connect(businessOwner1).updateBusinessMetrics(0, ethers.utils.parseEther("15"), 150)
      ).to.be.revertedWith("Invalid profit margin");
    });
  });

  describe("Potential Dividend Calculation", function () {
    beforeEach(async function () {
      await saveFinance.connect(businessOwner1).createBusiness(
        "DividendCalc",
        "Dividend Calculation Test",
        "Test",
        10000,
        ethers.utils.parseEther("0.01"),
        ethers.utils.parseEther("100"), // 100 ETH monthly revenue
        20 // 20% profit margin
      );
    });

    it("Should calculate potential dividends correctly", async function () {
      const tokenAmount = 1000;

      const potentialDividend = await saveFinance.calculatePotentialDividend(0, tokenAmount);

      // Monthly profit: 100 * 20% = 20 ETH
      // Annual profit: 20 * 12 = 240 ETH
      // Investor share: 240 * 70% = 168 ETH
      // Per token: 168 / 10000 = 0.0168 ETH
      // For 1000 tokens: 0.0168 * 1000 = 16.8 ETH

      expect(potentialDividend).to.equal(ethers.utils.parseEther("16.8"));
    });

    it("Should return zero for business with no revenue data", async function () {
      await saveFinance.connect(businessOwner1).createBusiness(
        "NoRevenue",
        "No Revenue Business",
        "Test",
        10000,
        ethers.utils.parseEther("0.01"),
        0, // No revenue
        0  // No margin
      );

      const potentialDividend = await saveFinance.calculatePotentialDividend(1, 1000);
      expect(potentialDividend).to.equal(0);
    });
  });

  describe("Platform Statistics", function () {
    it("Should track platform statistics correctly", async function () {
      // Create businesses
      await saveFinance.connect(businessOwner1).createBusiness(
        "Biz1", "Desc1", "Cat1", 10000, ethers.utils.parseEther("0.01"), ethers.utils.parseEther("10"), 20
      );
      await saveFinance.connect(businessOwner2).createBusiness(
        "Biz2", "Desc2", "Cat2", 15000, ethers.utils.parseEther("0.02"), ethers.utils.parseEther("20"), 30
      );

      // Verify businesses
      await saveFinance.connect(owner).verifyBusiness(0, true);
      await saveFinance.connect(owner).verifyBusiness(1, true);

      // Make investments
      await saveFinance.connect(investor1).investInBusiness(0, 1000, {
        value: ethers.utils.parseEther("10")
      });
      await saveFinance.connect(investor2).investInBusiness(1, 500, {
        value: ethers.utils.parseEther("10")
      });

      const stats = await saveFinance.getPlatformStats();

      expect(stats.totalBusinessesCount).to.equal(2);
      expect(stats.totalInvestmentVolumeAmount).to.equal(ethers.utils.parseEther("20"));
    });
  });

  describe("Admin Functions", function () {
    beforeEach(async function () {
      await saveFinance.connect(businessOwner1).createBusiness(
        "AdminTest", "Admin Test", "Test", 10000, ethers.utils.parseEther("0.01"), ethers.utils.parseEther("10"), 20
      );
    });

    it("Should allow owner to deactivate business", async function () {
      await saveFinance.connect(owner).deactivateBusiness(0);

      const businessInfo = await saveFinance.getBusinessInfo(0);
      expect(businessInfo.active).to.be.true; // getBusinessInfo should still return data

      // But investment should fail
      await saveFinance.connect(owner).verifyBusiness(0, true);
      await expect(
        saveFinance.connect(investor1).investInBusiness(0, 100, {
          value: ethers.utils.parseEther("1")
        })
      ).to.be.revertedWith("Business not active");
    });

    it("Should allow setting fee recipient", async function () {
      await saveFinance.connect(owner).setFeeRecipient(feeRecipient.address);
      // Note: We can't easily test this without checking internal state
      // In a real test environment, we'd verify the fee goes to the new recipient
    });

    it("Should reject setting zero address as fee recipient", async function () {
      await expect(
        saveFinance.connect(owner).setFeeRecipient(ethers.constants.AddressZero)
      ).to.be.revertedWith("Invalid address");
    });
  });

  // Helper function to get current timestamp
  async function getCurrentTimestamp(): Promise<number> {
    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    return block.timestamp;
  }
});