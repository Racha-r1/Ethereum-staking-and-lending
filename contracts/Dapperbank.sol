pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./tokens/DPK.sol";

contract DapperBank  {

    struct Stake {
        address investor;
        address token;
        uint amount;
        uint timestamp;
    }

    event Staked(
        address indexed investor, 
        address indexed token,
        uint amount
    );

    /// @notice token address -> investor address -> amount staked
    mapping(address => mapping(address => Stake)) public stakedBalances;

    /// @notice a user needs to stake his tokens at least for 300 seconds or 5 mins to receive the reward 
    uint private rewardPeriod = 300;

    DPK public DpkToken;
    address[] public assets;
    address public owner;
    address public tokenOwner;

    /// @notice constructor -> set owner to the person who deployed the contract
    /// @param _DpkToken address of the DPK token that we want to use as a reward token for staking
    constructor(DPK _DpkToken){
        owner = msg.sender;
        DpkToken = DPK(_DpkToken);
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
    function addTokenToAssets(address _token) public isOwner{
        assets.push(_token);
    }

    /// @param _amount the amount of tokens that the user wants to stake
    /// @param _token The address of the ERC-20 token that the user wants to stake
    function stake(uint _amount, address _token) public payable isAsset(_token) {
        require(_amount > 0, "Amount must be greater than 0");
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        Stake memory stake1 = Stake(msg.sender,_token, _amount, block.timestamp);
        stakedBalances[_token][msg.sender] = stake1;
        emit Staked(msg.sender, _token, _amount);
    }

    /// @param _token The address of the ERC-20 token that the user wants to unstake
    function unstake(address _token) public isAsset(_token){
        require(stakedBalances[_token][msg.sender].amount > 0, "Balance must be greater than 0");
        IERC20(_token).transfer(msg.sender, stakedBalances[_token][msg.sender].amount);
        stakedBalances[_token][msg.sender].amount = 0;
    }


    /// @notice getter function to get all the assets that are supported by the smart contract
    function getAssets() public view returns (address[] memory) {
        return assets;
    }

    function mintTokens(address _to, uint _amount) public{
        DpkToken.mint(_to, _amount);
    }

    /// @param _token The address of the ERC-20 token that the user has staked
    /// @notice reward is determined based on the amount of time that the user has staked (1 token = 5 mins)
    function claimReward(address _token) public isAsset(_token) {
        Stake memory stake1 = stakedBalances[_token][msg.sender];
        require(stake1.amount > 0, "You must stake some tokens before you can claim a reward!");
        uint claimInterval = 60;
        uint reward = (block.timestamp - stake1.timestamp) / 60;
        if (DpkToken.balanceOf(address(this)) < reward) {
            /// mint some tokens and send it to this contract
            mintTokens(address(this), 1000000 * 10 ** 18);
        }
        DpkToken.transfer(msg.sender, reward);
    }
}