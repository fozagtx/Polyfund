// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title Polyfunds - Real World Assets Business Investment Platform
 * @dev Tokenize businesses and enable fractional ownership with dividend distribution
 */
contract Polyfunds is ReentrancyGuard, Ownable {
    using SafeMath for uint256;

    // ============ BUSINESS TOKENIZATION ============

    struct Business {
        string name;
        string description;
        string category;
        address owner;
        address tokenContract;
        uint256 tokenSupply;
        uint256 tokenPrice;          // Price per token in wei
        uint256 totalRaised;         // Total ETH raised
        uint256 totalDividendsPaid;  // Total dividends distributed
        uint256 monthlyRevenue;      // Monthly revenue (for display)
        uint256 profitMargin;        // Profit margin percentage
        bool active;
        bool verified;               // KYC/verification status
        uint256 createdAt;
        uint256 lastDividendDate;
    }

    struct Investment {
        uint256 businessId;
        uint256 tokenAmount;
        uint256 investmentDate;
        uint256 totalDividendsReceived;
    }

    mapping(uint256 => Business) public businesses;
    mapping(address => uint256[]) public ownerBusinesses;
    mapping(address => Investment[]) public userInvestments;
    mapping(address => mapping(uint256 => uint256)) public userBusinessTokens; // user => businessId => tokens

    uint256 public businessCount;
    uint256 public totalBusinesses;
    uint256 public totalInvestmentVolume;
    uint256 public totalDividendsPaid;

    // Platform settings
    uint256 public constant MIN_TOKEN_SUPPLY = 1000;
    uint256 public constant MAX_TOKEN_SUPPLY = 1000000;
    uint256 public constant MIN_TOKEN_PRICE = 0.001 ether;
    uint256 public constant MAX_INVESTMENT_PER_BUSINESS = 25; // 25% max ownership per investor
    uint256 public constant PLATFORM_FEE = 300; // 3% platform fee (in basis points)
    uint256 public constant BASIS_POINTS = 10000;

    address public feeRecipient;

    // ============ EVENTS ============

    event BusinessCreated(
        uint256 indexed businessId,
        address indexed owner,
        string name,
        address tokenContract,
        uint256 tokenSupply,
        uint256 tokenPrice
    );

    event InvestmentMade(
        uint256 indexed businessId,
        address indexed investor,
        uint256 tokenAmount,
        uint256 ethAmount
    );

    event DividendDistributed(
        uint256 indexed businessId,
        uint256 totalAmount,
        uint256 timestamp
    );

    event DividendClaimed(
        address indexed investor,
        uint256 indexed businessId,
        uint256 amount
    );

    event BusinessVerified(uint256 indexed businessId, bool verified);

    event BusinessUpdated(
        uint256 indexed businessId,
        uint256 monthlyRevenue,
        uint256 profitMargin
    );

    // ============ MODIFIERS ============

    modifier validBusiness(uint256 businessId) {
        require(businessId < businessCount, "Business does not exist");
        require(businesses[businessId].active, "Business not active");
        _;
    }

    modifier onlyBusinessOwner(uint256 businessId) {
        require(msg.sender == businesses[businessId].owner, "Not business owner");
        _;
    }

    modifier onlyVerifiedBusiness(uint256 businessId) {
        require(businesses[businessId].verified, "Business not verified");
        _;
    }

    // ============ CONSTRUCTOR ============

    constructor() {
        feeRecipient = owner();
    }

    // ============ BUSINESS FUNCTIONS ============

    /**
     * @dev Create a new tokenized business
     */
    function createBusiness(
        string memory name,
        string memory description,
        string memory category,
        uint256 tokenSupply,
        uint256 tokenPrice,
        uint256 monthlyRevenue,
        uint256 profitMargin
    ) external returns (uint256 businessId) {
        require(bytes(name).length > 0, "Business name required");
        require(bytes(description).length > 0, "Description required");
        require(tokenSupply >= MIN_TOKEN_SUPPLY && tokenSupply <= MAX_TOKEN_SUPPLY, "Invalid token supply");
        require(tokenPrice >= MIN_TOKEN_PRICE, "Token price too low");
        require(profitMargin <= 100, "Invalid profit margin");

        businessId = businessCount;
        businessCount = businessCount.add(1);

        // Deploy business token contract
        BusinessToken token = new BusinessToken(
            string(abi.encodePacked("Poly-", name)),
            "POLY",
            tokenSupply,
            address(this)
        );

        businesses[businessId] = Business({
            name: name,
            description: description,
            category: category,
            owner: msg.sender,
            tokenContract: address(token),
            tokenSupply: tokenSupply,
            tokenPrice: tokenPrice,
            totalRaised: 0,
            totalDividendsPaid: 0,
            monthlyRevenue: monthlyRevenue,
            profitMargin: profitMargin,
            active: true,
            verified: false, // Requires admin verification
            createdAt: block.timestamp,
            lastDividendDate: 0
        });

        ownerBusinesses[msg.sender].push(businessId);
        totalBusinesses = totalBusinesses.add(1);

        emit BusinessCreated(businessId, msg.sender, name, address(token), tokenSupply, tokenPrice);
    }

    /**
     * @dev Invest in a business by purchasing tokens
     */
    function investInBusiness(uint256 businessId, uint256 tokenAmount)
        external
        payable
        nonReentrant
        validBusiness(businessId)
        onlyVerifiedBusiness(businessId)
    {
        Business storage business = businesses[businessId];

        uint256 totalCost = tokenAmount.mul(business.tokenPrice);
        require(msg.value == totalCost, "Incorrect ETH amount");

        BusinessToken token = BusinessToken(payable(business.tokenContract));
        require(token.balanceOf(address(this)) >= tokenAmount, "Insufficient tokens available");

        // Check maximum investment limit (25% of total supply)
        uint256 maxTokensPerInvestor = business.tokenSupply.mul(MAX_INVESTMENT_PER_BUSINESS).div(100);
        uint256 currentTokens = userBusinessTokens[msg.sender][businessId];
        require(currentTokens.add(tokenAmount) <= maxTokensPerInvestor, "Exceeds maximum investment limit");

        // Calculate platform fee
        uint256 platformFee = totalCost.mul(PLATFORM_FEE).div(BASIS_POINTS);
        uint256 businessAmount = totalCost.sub(platformFee);

        // Transfer tokens to investor
        require(token.transfer(msg.sender, tokenAmount), "Token transfer failed");

        // Update tracking
        userBusinessTokens[msg.sender][businessId] = currentTokens.add(tokenAmount);
        business.totalRaised = business.totalRaised.add(businessAmount);
        totalInvestmentVolume = totalInvestmentVolume.add(totalCost);

        // Record investment
        userInvestments[msg.sender].push(Investment({
            businessId: businessId,
            tokenAmount: tokenAmount,
            investmentDate: block.timestamp,
            totalDividendsReceived: 0
        }));

        // Send funds
        payable(business.owner).transfer(businessAmount);
        payable(feeRecipient).transfer(platformFee);

        emit InvestmentMade(businessId, msg.sender, tokenAmount, totalCost);
    }

    /**
     * @dev Distribute dividends to token holders
     */
    function distributeDividends(uint256 businessId)
        external
        payable
        nonReentrant
        validBusiness(businessId)
        onlyBusinessOwner(businessId)
    {
        require(msg.value > 0, "Must send ETH for dividends");

        Business storage business = businesses[businessId];
        BusinessToken token = BusinessToken(payable(business.tokenContract));

        uint256 totalSupply = business.tokenSupply;
        uint256 tokensInCirculation = totalSupply.sub(token.balanceOf(address(this)));

        require(tokensInCirculation > 0, "No tokens in circulation");

        // Calculate dividend per token
        uint256 dividendPerToken = msg.value.div(tokensInCirculation);

        // Store dividend info in token contract for claiming
        token.distributeDividends{value: msg.value}(dividendPerToken);

        business.totalDividendsPaid = business.totalDividendsPaid.add(msg.value);
        business.lastDividendDate = block.timestamp;
        totalDividendsPaid = totalDividendsPaid.add(msg.value);

        emit DividendDistributed(businessId, msg.value, block.timestamp);
    }

    /**
     * @dev Update business financial metrics
     */
    function updateBusinessMetrics(
        uint256 businessId,
        uint256 monthlyRevenue,
        uint256 profitMargin
    ) external validBusiness(businessId) onlyBusinessOwner(businessId) {
        require(profitMargin <= 100, "Invalid profit margin");

        Business storage business = businesses[businessId];
        business.monthlyRevenue = monthlyRevenue;
        business.profitMargin = profitMargin;

        emit BusinessUpdated(businessId, monthlyRevenue, profitMargin);
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @dev Verify a business (admin only)
     */
    function verifyBusiness(uint256 businessId, bool verified)
        external
        onlyOwner
        validBusiness(businessId)
    {
        businesses[businessId].verified = verified;
        emit BusinessVerified(businessId, verified);
    }

    /**
     * @dev Deactivate a business (admin only)
     */
    function deactivateBusiness(uint256 businessId)
        external
        onlyOwner
        validBusiness(businessId)
    {
        businesses[businessId].active = false;
    }

    /**
     * @dev Set fee recipient
     */
    function setFeeRecipient(address newFeeRecipient) external onlyOwner {
        require(newFeeRecipient != address(0), "Invalid address");
        feeRecipient = newFeeRecipient;
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @dev Get business information
     */
    function getBusinessInfo(uint256 businessId)
        external
        view
        returns (
            string memory name,
            string memory description,
            string memory category,
            address owner,
            address tokenContract,
            uint256 tokenSupply,
            uint256 tokenPrice,
            uint256 totalRaised,
            uint256 monthlyRevenue,
            uint256 profitMargin,
            bool active,
            bool verified,
            uint256 tokensAvailable
        )
    {
        require(businessId < businessCount, "Business does not exist");

        Business storage business = businesses[businessId];
        BusinessToken token = BusinessToken(payable(business.tokenContract));

        return (
            business.name,
            business.description,
            business.category,
            business.owner,
            business.tokenContract,
            business.tokenSupply,
            business.tokenPrice,
            business.totalRaised,
            business.monthlyRevenue,
            business.profitMargin,
            business.active,
            business.verified,
            token.balanceOf(address(this))
        );
    }

    /**
     * @dev Get user's investments
     */
    function getUserInvestments(address user) external view returns (Investment[] memory) {
        return userInvestments[user];
    }

    /**
     * @dev Get user's token balance for a specific business
     */
    function getUserBusinessTokens(address user, uint256 businessId) external view returns (uint256) {
        return userBusinessTokens[user][businessId];
    }

    /**
     * @dev Get businesses owned by an address
     */
    function getOwnerBusinesses(address owner) external view returns (uint256[] memory) {
        return ownerBusinesses[owner];
    }

    /**
     * @dev Get platform statistics
     */
    function getPlatformStats() external view returns (
        uint256 totalBusinessesCount,
        uint256 totalInvestmentVolumeAmount,
        uint256 totalDividendsPaidAmount,
        uint256 contractBalance
    ) {
        return (
            totalBusinesses,
            totalInvestmentVolume,
            totalDividendsPaid,
            address(this).balance
        );
    }

    /**
     * @dev Calculate potential dividend for investment
     */
    function calculatePotentialDividend(
        uint256 businessId,
        uint256 tokenAmount
    ) external view validBusiness(businessId) returns (uint256) {
        Business storage business = businesses[businessId];

        if (business.monthlyRevenue == 0 || business.profitMargin == 0) {
            return 0;
        }

        // Monthly profit
        uint256 monthlyProfit = business.monthlyRevenue.mul(business.profitMargin).div(100);

        // Annual dividend potential (70% of profit to investors)
        uint256 annualDividends = monthlyProfit.mul(12).mul(70).div(100);

        // Per token dividend
        uint256 dividendPerToken = annualDividends.div(business.tokenSupply);

        return dividendPerToken.mul(tokenAmount);
    }

    // Receive ETH
    receive() external payable {}
}

/**
 * @title Business Token
 * @dev ERC20 token representing business shares with dividend functionality
 */
contract BusinessToken {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => uint256) public dividendCredits;

    address public polyfundsContract;
    uint256 public totalDividendsDistributed;
    uint256 public currentDividendPerToken;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event DividendDistributed(uint256 totalAmount, uint256 dividendPerToken);
    event DividendClaimed(address indexed holder, uint256 amount);

    modifier onlyPolyfunds() {
        require(msg.sender == polyfundsContract, "Only Polyfunds contract");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        address _polyfundsContract
    ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * 10**decimals;
        balanceOf[_polyfundsContract] = totalSupply;
        polyfundsContract = _polyfundsContract;
        emit Transfer(address(0), _polyfundsContract, totalSupply);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;

        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");

        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;

        emit Transfer(from, to, amount);
        return true;
    }

    /**
     * @dev Distribute dividends (called by Polyfunds contract)
     */
    function distributeDividends(uint256 dividendPerToken) external payable onlyPolyfunds {
        require(msg.value > 0, "Must send ETH");

        currentDividendPerToken = dividendPerToken;
        totalDividendsDistributed += msg.value;

        emit DividendDistributed(msg.value, dividendPerToken);
    }

    /**
     * @dev Claim dividends for token holder
     */
    function claimDividends() external {
        require(balanceOf[msg.sender] > 0, "No tokens owned");
        require(currentDividendPerToken > 0, "No dividends available");

        uint256 dividendAmount = balanceOf[msg.sender] * currentDividendPerToken / (10**decimals);

        require(dividendAmount > 0, "No dividends to claim");
        require(address(this).balance >= dividendAmount, "Insufficient contract balance");

        dividendCredits[msg.sender] += dividendAmount;

        payable(msg.sender).transfer(dividendAmount);

        emit DividendClaimed(msg.sender, dividendAmount);
    }

    /**
     * @dev Get claimable dividends for an address
     */
    function getClaimableDividends(address holder) external view returns (uint256) {
        if (balanceOf[holder] == 0 || currentDividendPerToken == 0) {
            return 0;
        }

        return balanceOf[holder] * currentDividendPerToken / (10**decimals);
    }

    // Receive ETH for dividends
    receive() external payable {}
}