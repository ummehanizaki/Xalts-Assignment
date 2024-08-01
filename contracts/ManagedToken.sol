// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IManagedToken.sol";
import "./interfaces/IWhitelistOracle.sol";

contract ManagedToken is ERC20, Ownable, AccessControl, IManagedToken {
    // Mapping to track wallet information
    mapping(address => bool) public isUserWhitelisted;
    address whitelistOracle;

    // Constructor takes an array of 5 initial whitelisted addresses
    constructor(
        address[] memory initialWhitelistedAddresses,
        address _whitelistOracle
    ) ERC20("ManagedToken", "MTK") Ownable(msg.sender) {
        require(
            initialWhitelistedAddresses.length == 5,
            "Exactly 5 addresses required"
        );
        whitelistOracle = _whitelistOracle;
        for (uint256 i = 0; i < initialWhitelistedAddresses.length; i++) {
            _toggleTokenAccess(initialWhitelistedAddresses[i], true);
        }
    }

    // Modifier to check if the sender and recipient are whitelisted
    modifier onlyWhitelisted(address recipient) {
        require(
            IWhitelistOracle(whitelistOracle).isWhitelisted(msg.sender),
            "Sender is not whitelisted"
        );
        require(
            IWhitelistOracle(whitelistOracle).isWhitelisted(recipient),
            "Receiver is not whitelisted"
        );
        _;
    }

    // External toggleTokenAccess to whitelist or blacklist a wallet
    function _toggleTokenAccess(
        address userAddress,
        bool isWhitelisted
    ) internal {
        require(
            IWhitelistOracle(whitelistOracle).isWhitelisted(userAddress) !=
                isWhitelisted,
            "Status is same as current"
        );
        emit TokenAccessToggled(userAddress, isWhitelisted);
    }

    // External toggleTokenAccess to whitelist or blacklist a wallet
    function toggleTokenAccess(
        address userAddress,
        bool isWhitelisted
    ) public onlyOwner {
        require(userAddress != owner());
        _toggleTokenAccess(userAddress, isWhitelisted);
    }

    // Override transfer function with whitelist checks
    function transfer(
        address recipient,
        uint256 amount
    ) public virtual override onlyWhitelisted(recipient) returns (bool) {
        return super.transfer(recipient, amount);
    }

    // Override transferFrom function with whitelist checks
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override onlyWhitelisted(recipient) returns (bool) {
        return super.transferFrom(sender, recipient, amount);
    }

    // Function to mint new tokens
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
