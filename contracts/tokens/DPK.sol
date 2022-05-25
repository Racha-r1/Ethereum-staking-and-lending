// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DPK is ERC20, Ownable {
 
    constructor() ERC20("Dapperbank token", "DPK") {
        _mint(msg.sender, 1000000 * 10**18);
    }

    /// @param _to the address of the recipient
    /// @param _amount the amount to be minted
    function mint(address _to, uint256 _amount) external onlyOwner {
            _mint(_to, _amount);
    }

    /// @param _amount the amount of tokens to be burned
    function burn(uint256 _amount) external onlyOwner {
        _burn(msg.sender, _amount);
    }
    
}