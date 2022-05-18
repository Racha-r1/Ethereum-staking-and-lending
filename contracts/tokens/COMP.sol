// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract COMP is ERC20 {
    address public owner;
    modifier isOwner {
        require(msg.sender == owner, "Only the owner is allowed to perform this operation");
        _;
    }
   
   constructor() ERC20("Compound", "COMP") {
       _mint(msg.sender, 1000000 * 10**18);
       owner = msg.sender;
   }

   /// @param _to the address of the recipient
   /// @param _amount the amount to be minted
   function mint(address _to, uint256 _amount) external isOwner{
        _mint(_to, _amount);
   }

   /// @param _amount the amount of tokens to be burned
   function burn(uint256 _amount) external isOwner{
       _burn(msg.sender, _amount);
   }
}