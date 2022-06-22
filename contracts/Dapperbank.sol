pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./PriceConsumerV3.sol";

contract DapperBank  {

    struct Stake {
        address investor;
        address token;
        uint amount;
        uint timestamp;
        bool staked;
    }

    struct Loan {
        address issuer;
        address token;
        uint intrest;
        uint amount;
        uint duration;
        uint timestamp;
    }

    event Staked(
        address indexed investor, 
        uint256 indexed timestamp,
        uint indexed amount,
        string symbol
    );

    event Unstaked(
        address indexed investor, 
        uint256 indexed timestamp,
        uint indexed amount,
        string symbol
    );

    event Borrowed(
        address indexed issuer, 
        uint256 indexed timestamp,
        uint indexed amount,
        string symbol
    );

    event Repaid(
        address indexed borrower,
        uint indexed amount,
        bool indexed success,
        uint256 timestamp,
        string symbol
    );

    /// @notice token address -> investor address -> amount staked
    mapping(address => mapping(address => Stake)) public stakedBalances;

    /// @notice token address -> amount of tokens stored in the contract (This way we can now how much liquidity is in the contract)
    mapping(address => uint256) public  tokenBalances;

    /// @notice token address -> amount of rewards per user
    mapping(address => uint) public rewardsEarned;

    /// @notice user address => token address -> amount of tokens that are locked due to a lend
    mapping(address => mapping(address => uint)) public lockedAssets;

    /// @notice user address => token address -> amount of rewards that are locked due to a lend
    mapping(address => mapping(address => uint)) public lockedRewards;

    /// @notice user address -> token address -> amount of tokens loaned
    mapping(address => mapping(address => Loan)) public loans;

    /// @notice a user needs to stake his tokens at least for 300 seconds or 5 mins to receive the reward 
    uint256 private rewardPeriod = 60;

    /// @notice the contract of the reward token
    IERC20 public dpkToken;

    address[] public assets;
    address public owner;


    /// @notice constructor -> set owner to the person who deployed the contract
    constructor(address _dpkToken) {
        owner = msg.sender;
        dpkToken = IERC20(_dpkToken);
    }

    /// @param _token The address of any ERC-20 token 
    /// @return boolean value that indicates whether the token is a asset that our contract supports
    function inAssets(address _token) public view returns (bool) {
        for (uint i = 0; i < assets.length; i+=1) {
            if (assets[i] == _token) {
                return true;
            }
        }
        return false;
    }

    modifier isOwner {
        require(msg.sender == owner, "Only the owner is allowed to perform this operation");
        _;
    }

    modifier isAsset(address _token){
        require(inAssets(_token), "The token is not an asset that our contract supports");
        _;
    }

    /// @param _token the token has to be added to the list of assets
    /// @notice only the owner should be able to add a token to the assets list thats why we use the owner modifier  
    function addTokenToAssets(address _token) external isOwner{
        assets.push(_token);
    }

    /// @param _amount the amount of tokens that the user wants to stake
    /// @param _token The address of the ERC-20 token that the user wants to stake
    function stake(uint _amount, address _token) external payable isAsset(_token) {
        require(_amount > 0, "Amount must be greater than 0");
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);

        stakedBalances[_token][msg.sender].investor = msg.sender;
        stakedBalances[_token][msg.sender].token = _token;
        stakedBalances[_token][msg.sender].amount += _amount;

        if (stakedBalances[_token][msg.sender].timestamp == 0){
            stakedBalances[_token][msg.sender].timestamp = block.timestamp;
        }

        stakedBalances[_token][msg.sender].staked = true;
        tokenBalances[_token] += _amount;
        string memory _symbol = ERC20(_token).symbol();
        emit Staked(msg.sender, block.timestamp, _amount, _symbol);
    }

    /// @param _token The address of the ERC-20 token that the user wants to unstake
    function unstake(address _token, uint amount) external isAsset(_token){
        require(stakedBalances[_token][msg.sender].amount > 0, "Balance must be greater than 0");
        require(stakedBalances[_token][msg.sender].amount >= amount , "The amount that you want to withdraw is to high");
        IERC20(_token).transfer(msg.sender, amount);
        stakedBalances[_token][msg.sender].amount = stakedBalances[_token][msg.sender].amount - amount;

        if (stakedBalances[_token][msg.sender].amount == 0){
            stakedBalances[_token][msg.sender].timestamp = 0;
            stakedBalances[_token][msg.sender].staked = false;
            stakedBalances[_token][msg.sender].token = address(0);
        }

        tokenBalances[_token] = tokenBalances[_token] - amount;
        string memory _symbol = ERC20(_token).symbol();
        emit Unstaked(msg.sender, block.timestamp, amount, _symbol);
    }


    /// @notice getter function to get all the assets that are supported by the smart contract
    function getAssets() public view returns (address[] memory) {
        return assets;
    }

    /// @notice reward is determined based on the amount of time that the user has staked (1 token = 5 mins)
    function claimRewards(address[] memory _tokens) external {
        for (uint i=0; i < _tokens.length; i+=1){
            uint reward;
            Stake storage stakeStruct = stakedBalances[_tokens[i]][msg.sender];
            uint tokenAmount = stakeStruct.amount / 10**18;
            uint multiplier = tokenAmount / 100; // 1 DPK token for each 100 tokens staked

            if (stakeStruct.amount > 0 && stakeStruct.timestamp > 0) {
                reward = ((uint(block.timestamp - stakeStruct.timestamp) / uint(rewardPeriod)) * multiplier) * (10**18);
               
                if (reward > 0) {
                    if(dpkToken.transfer(msg.sender, reward)){
                        rewardsEarned[msg.sender] += reward;
                        // reset timestamp
                        stakeStruct.timestamp = block.timestamp;
                        stakedBalances[_tokens[i]][msg.sender] = stakeStruct;
                    }
                }   
            }
        }
    }

    /// @param _amount The amount that the issuer wants to get from his loan
    /// @param _token The address of the ERC-20 token that the issuer wants to get from his loan
    function takeLoan(uint _amount, address _token) external payable isAsset(_token){
        require(tokenBalances[_token] > _amount, "Insufficient liquidity for the token");
        require(loans[msg.sender][_token].amount == 0, "You already have a loan");
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        IERC20(_token).transfer(msg.sender, _amount);
        uint intrest = (_amount / 100) * 5;
        uint duration = 120;
        Loan memory loan = Loan(msg.sender, _token, intrest, _amount, duration, block.timestamp);
        loans[msg.sender][_token] = loan;
        lockedAssets[msg.sender][_token] += _amount;
        tokenBalances[_token] = tokenBalances[_token] - _amount;
        emit Borrowed(msg.sender, block.timestamp, _amount, ERC20(_token).symbol());
    }

    function repayLoan(address _token) external payable isAsset(_token){
        require(loans[msg.sender][_token].amount > 0, "You do not have a loan");
        string memory _symbol = ERC20(_token).symbol();

        if (block.timestamp > (loans[msg.sender][_token].timestamp + loans[msg.sender][_token].duration)){
            // take colleteral from him because he couldn't pay the loan in time
            tokenBalances[_token] += lockedAssets[msg.sender][_token];
            emit Repaid(msg.sender, lockedAssets[msg.sender][_token], false, block.timestamp, _symbol);
            lockedAssets[msg.sender][_token] = 0;

            // also take the rewards that he got on the locked assets
            lockedRewards[msg.sender][_token] = 0;
        }

        else {
            uint total = loans[msg.sender][_token].amount + loans[msg.sender][_token].intrest;
            IERC20(_token).transferFrom(msg.sender, address(this), total);
            tokenBalances[_token] += lockedAssets[msg.sender][_token];

            uint lockedMultiplier;

            // calculate yield on the locked assets
            lockedMultiplier = lockedAssets[msg.sender][_token] / 10**20;

            uint rewardsForLockedAssets = ((uint(block.timestamp - loans[msg.sender][_token].timestamp) / uint(rewardPeriod)) * lockedMultiplier) * (10**18);

            // add lockedRewards
            if(rewardsForLockedAssets > 0){
                lockedRewards[msg.sender][_token] += rewardsForLockedAssets;
            }

            if(IERC20(_token).transfer(msg.sender, lockedAssets[msg.sender][_token])){
                lockedAssets[msg.sender][_token] = 0;
            }

            // pay the rewards that he got on the locked assets
            if(lockedRewards[msg.sender][_token] > 0){
                if(IERC20(dpkToken).transfer(msg.sender, lockedRewards[msg.sender][_token])){
                    lockedRewards[msg.sender][_token] = 0;
                }
            }

            emit Repaid(msg.sender, total, true, block.timestamp, _symbol);
        }

        // reset loan
        Loan memory l = loans[msg.sender][_token];
        l.issuer = address(0);
        l.amount = 0;
        l.intrest = 0;
        l.duration = 0;
        l.timestamp = 0;
        l.token = address(0);

        loans[msg.sender][_token] = l;
    }
}