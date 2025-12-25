import { expect } from "chai";
import { ethers } from "hardhat";
import { SaveFinance } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("SaveFinance", function () {
  let saveFinance: SaveFinance;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let businessOwner: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2, businessOwner] = await ethers.getSigners();

    const SaveFinance = await ethers.getContractFactory("SaveFinance");
    saveFinance = await SaveFinance.deploy();
    await saveFinance.deployed();
  });

  describe("Savings Module", function () {
    describe("Deposits", function () {
      it("Should allow users to deposit ETH", async function () {
        const depositAmount = ethers.utils.parseEther("1.0");

        await expect(saveFinance.connect(user1).deposit({ value: depositAmount }))
          .to.emit(saveFinance, "Deposited")
          .withArgs(user1.address, depositAmount, await getCurrentTimestamp());

        const [principal, accruedYield, totalBalance] = await saveFinance.getUserBalance(user1.address);
        expect(principal).to.equal(depositAmount);
        expect(accruedYield).to.equal(0);
        expect(totalBalance).to.equal(depositAmount);
      });

      it("Should reject zero deposits", async function () {
        await expect(saveFinance.connect(user1).deposit({ value: 0 }))
          .to.be.revertedWith("Deposit amount must be greater than 0");
      });

      it("Should accumulate multiple deposits", async function () {
        const firstDeposit = ethers.utils.parseEther("1.0");
        const secondDeposit = ethers.utils.parseEther("0.5");

        await saveFinance.connect(user1).deposit({ value: firstDeposit });
        await saveFinance.connect(user1).deposit({ value: secondDeposit });

        const [principal] = await saveFinance.getUserBalance(user1.address);
        expect(principal).to.equal(firstDeposit.add(secondDeposit));
      });
    });

    describe("Yield Calculation", function () {
      it("Should accrue yield over time", async function () {
        const depositAmount = ethers.utils.parseEther("1.0");
        await saveFinance.connect(user1).deposit({ value: depositAmount });

        // Fast forward 365 days (1 year)
        await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine", []);

        const [principal, accruedYield, totalBalance] = await saveFinance.getUserBalance(user1.address);

        expect(principal).to.equal(depositAmount);
        // Should be approximately 5% yield (0.05 ETH)
        expect(accruedYield).to.be.closeTo(
          ethers.utils.parseEther("0.05"),
          ethers.utils.parseEther("0.001") // 0.1% tolerance
        );
        expect(totalBalance).to.equal(principal.add(accruedYield));
      });

      it("Should calculate yield proportionally for partial year", async function () {
        const depositAmount = ethers.utils.parseEther("1.0");
        await saveFinance.connect(user1).deposit({ value: depositAmount });

        // Fast forward 182.5 days (half year)
        await ethers.provider.send("evm_increaseTime", [Math.floor(182.5 * 24 * 60 * 60)]);
        await ethers.provider.send("evm_mine", []);

        const [, accruedYield] = await saveFinance.getUserBalance(user1.address);

        // Should be approximately 2.5% yield (0.025 ETH) for half year
        expect(accruedYield).to.be.closeTo(
          ethers.utils.parseEther("0.025"),
          ethers.utils.parseEther("0.001")
        );
      });
    });

    describe("Withdrawals", function () {
      it("Should allow full withdrawal of principal and yield", async function () {
        const depositAmount = ethers.utils.parseEther("1.0");
        await saveFinance.connect(user1).deposit({ value: depositAmount });

        // Add some ETH to contract to pay yield
        await owner.sendTransaction({
          to: saveFinance.address,
          value: ethers.utils.parseEther("1.0")
        });

        // Fast forward to accrue yield
        await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine", []);

        const balanceBefore = await user1.getBalance();
        const [, , totalBalance] = await saveFinance.getUserBalance(user1.address);

        const tx = await saveFinance.connect(user1).withdraw(0);
        const receipt = await tx.wait();
        const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

        const balanceAfter = await user1.getBalance();

        expect(balanceAfter.add(gasUsed)).to.be.closeTo(
          balanceBefore.add(totalBalance),
          ethers.utils.parseEther("0.001")
        );
      });

      it("Should allow partial withdrawals", async function () {
        const depositAmount = ethers.utils.parseEther("2.0");
        const withdrawAmount = ethers.utils.parseEther("0.5");

        await saveFinance.connect(user1).deposit({ value: depositAmount });
        await saveFinance.connect(user1).withdraw(withdrawAmount);

        const [principal] = await saveFinance.getUserBalance(user1.address);
        expect(principal).to.equal(depositAmount.sub(withdrawAmount));
      });

      it("Should reject withdrawal of more than available balance", async function () {
        const depositAmount = ethers.utils.parseEther("1.0");
        const withdrawAmount = ethers.utils.parseEther("2.0");

        await saveFinance.connect(user1).deposit({ value: depositAmount });

        await expect(saveFinance.connect(user1).withdraw(withdrawAmount))
          .to.be.revertedWith("Insufficient balance");
      });

      it("Should deactivate account when principal reaches zero", async function () {
        const depositAmount = ethers.utils.parseEther("1.0");

        await saveFinance.connect(user1).deposit({ value: depositAmount });
        await saveFinance.connect(user1).withdraw(depositAmount);

        const savings = await saveFinance.userSavings(user1.address);
        expect(savings.active).to.be.false;
      });
    });

    describe("Yield Claiming", function () {
      it("Should allow claiming yield without withdrawing principal", async function () {
        const depositAmount = ethers.utils.parseEther("1.0");
        await saveFinance.connect(user1).deposit({ value: depositAmount });

        // Add ETH for yield payments
        await owner.sendTransaction({
          to: saveFinance.address,
          value: ethers.utils.parseEther("1.0")
        });

        // Fast forward to accrue yield
        await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine", []);

        const [, yieldBefore] = await saveFinance.getUserBalance(user1.address);

        await expect(saveFinance.connect(user1).claimYield())
          .to.emit(saveFinance, "YieldClaimed")
          .withArgs(user1.address, yieldBefore);

        const [principal, yieldAfter] = await saveFinance.getUserBalance(user1.address);
        expect(principal).to.equal(depositAmount);
        expect(yieldAfter).to.equal(0);
      });

      it("Should reject claiming when no yield available", async function () {
        const depositAmount = ethers.utils.parseEther("1.0");
        await saveFinance.connect(user1).deposit({ value: depositAmount });

        await expect(saveFinance.connect(user1).claimYield())
          .to.be.revertedWith("No yield to claim");
      });
    });
  });

  describe("Business Module", function () {
    describe("Business Creation", function () {
      it("Should allow creating a business with tokens", async function () {
        const businessName = "Test Business";
        const description = "A test business";
        const tokenSupply = 10000;
        const pricePerToken = ethers.utils.parseEther("0.01");

        await expect(
          saveFinance.connect(businessOwner).createBusiness(
            businessName,
            description,
            tokenSupply,
            pricePerToken
          )
        ).to.emit(saveFinance, "BusinessCreated");

        const businessInfo = await saveFinance.getBusinessInfo(0);
        expect(businessInfo.name).to.equal(businessName);
        expect(businessInfo.description).to.equal(description);
        expect(businessInfo.owner).to.equal(businessOwner.address);
        expect(businessInfo.tokenSupply).to.equal(tokenSupply);
        expect(businessInfo.pricePerToken).to.equal(pricePerToken);
      });

      it("Should reject business with empty name", async function () {
        await expect(
          saveFinance.connect(businessOwner).createBusiness(
            "",
            "Description",
            10000,
            ethers.utils.parseEther("0.01")
          )
        ).to.be.revertedWith("Business name required");
      });

      it("Should reject invalid token supply", async function () {
        await expect(
          saveFinance.connect(businessOwner).createBusiness(
            "Test",
            "Description",
            100, // Too low
            ethers.utils.parseEther("0.01")
          )
        ).to.be.revertedWith("Invalid token supply");

        await expect(
          saveFinance.connect(businessOwner).createBusiness(
            "Test",
            "Description",
            2000000, // Too high
            ethers.utils.parseEther("0.01")
          )
        ).to.be.revertedWith("Invalid token supply");
      });

      it("Should reject price below minimum", async function () {
        await expect(
          saveFinance.connect(businessOwner).createBusiness(
            "Test",
            "Description",
            10000,
            ethers.utils.parseEther("0.0001") // Too low
          )
        ).to.be.revertedWith("Price too low");
      });
    });

    describe("Token Purchases", function () {
      beforeEach(async function () {
        await saveFinance.connect(businessOwner).createBusiness(
          "Test Business",
          "A test business",
          10000,
          ethers.utils.parseEther("0.01")
        );
      });

      it("Should allow purchasing business tokens", async function () {
        const tokenAmount = 100;
        const totalCost = ethers.utils.parseEther("1.0"); // 100 * 0.01 ETH

        const ownerBalanceBefore = await businessOwner.getBalance();

        await expect(
          saveFinance.connect(user1).purchaseBusinessTokens(0, tokenAmount, {
            value: totalCost
          })
        ).to.emit(saveFinance, "BusinessTokensPurchased")
         .withArgs(0, user1.address, tokenAmount, totalCost);

        const ownerBalanceAfter = await businessOwner.getBalance();
        expect(ownerBalanceAfter).to.equal(ownerBalanceBefore.add(totalCost));

        const businessInfo = await saveFinance.getBusinessInfo(0);
        expect(businessInfo.totalRaised).to.equal(totalCost);
      });

      it("Should reject incorrect payment amount", async function () {
        const tokenAmount = 100;
        const incorrectPayment = ethers.utils.parseEther("0.5");

        await expect(
          saveFinance.connect(user1).purchaseBusinessTokens(0, tokenAmount, {
            value: incorrectPayment
          })
        ).to.be.revertedWith("Incorrect ETH amount");
      });

      it("Should reject purchase from non-existent business", async function () {
        const tokenAmount = 100;
        const totalCost = ethers.utils.parseEther("1.0");

        await expect(
          saveFinance.connect(user1).purchaseBusinessTokens(999, tokenAmount, {
            value: totalCost
          })
        ).to.be.revertedWith("Business does not exist");
      });
    });

    describe("Business Management", function () {
      beforeEach(async function () {
        await saveFinance.connect(businessOwner).createBusiness(
          "Test Business",
          "A test business",
          10000,
          ethers.utils.parseEther("0.01")
        );
      });

      it("Should track owner businesses", async function () {
        const ownerBusinesses = await saveFinance.getOwnerBusinesses(businessOwner.address);
        expect(ownerBusinesses.length).to.equal(1);
        expect(ownerBusinesses[0]).to.equal(0);
      });

      it("Should allow owner to deactivate business", async function () {
        await saveFinance.connect(owner).deactivateBusiness(0);

        const businessInfo = await saveFinance.getBusinessInfo(0);
        expect(businessInfo.name).to.equal("Test Business"); // Still accessible

        // But purchasing should fail
        await expect(
          saveFinance.connect(user1).purchaseBusinessTokens(0, 100, {
            value: ethers.utils.parseEther("1.0")
          })
        ).to.be.revertedWith("Business not active");
      });
    });
  });

  describe("Contract Management", function () {
    it("Should track total statistics", async function () {
      const depositAmount = ethers.utils.parseEther("2.0");

      await saveFinance.connect(user1).deposit({ value: depositAmount });
      await saveFinance.connect(businessOwner).createBusiness(
        "Test Business",
        "A test business",
        10000,
        ethers.utils.parseEther("0.01")
      );

      const stats = await saveFinance.getTotalStats();
      expect(stats.totalSavingsAmount).to.equal(depositAmount);
      expect(stats.totalBusinesses).to.equal(1);
      expect(stats.contractBalance).to.equal(depositAmount);
    });

    it("Should allow emergency withdrawal by owner", async function () {
      const depositAmount = ethers.utils.parseEther("1.0");
      await saveFinance.connect(user1).deposit({ value: depositAmount });

      const ownerBalanceBefore = await owner.getBalance();
      const tx = await saveFinance.connect(owner).emergencyWithdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

      const ownerBalanceAfter = await owner.getBalance();
      expect(ownerBalanceAfter).to.equal(
        ownerBalanceBefore.add(depositAmount).sub(gasUsed)
      );
    });
  });

  // Helper function to get current timestamp
  async function getCurrentTimestamp(): Promise<number> {
    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    return block.timestamp;
  }
});