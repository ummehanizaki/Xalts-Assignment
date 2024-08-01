// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IWhitelistOracle.sol";

/**
 * @title WhitelistControlledToken
 * @dev ERC20 token with access control and whitelist functionality.
 */
contract WhitelistControlledToken is ERC20, Ownable, AccessControl {
    bytes32 public constant WHITELISTER_ROLE = keccak256("WHITELISTER_ROLE");
    address public whitelistOracle;

    event TokenAccessChanged(address indexed userAddress, bool isWhitelisted);
    event WhitelistOracleUpdated(address indexed newWhitelistOracle);

    /**
     * @notice Constructor to initialize the token and set up the initial whitelist.
     * @param initialWhitelistedAddresses Array of addresses to be initially whitelisted.
     * @param _whitelistOracle Address of the whitelist oracle contract.
     */
    constructor(
        address[] memory initialWhitelistedAddresses,
        address _whitelistOracle
    ) ERC20("WhitelistControlledToken", "WCT") Ownable(msg.sender) {
        require(
            initialWhitelistedAddresses.length == 5,
            "Exactly 5 addresses required"
        );
        whitelistOracle = _whitelistOracle;
        _grantRole(WHITELISTER_ROLE, msg.sender);
        for (uint256 i = 0; i < initialWhitelistedAddresses.length; i++) {
            _updateTokenAccess(initialWhitelistedAddresses[i], true);
        }
    }

    /**
     * @dev Modifier to check if both sender and recipient are whitelisted.
     * @param sender Address of the sender.
     * @param recipient Address of the recipient.
     */
    modifier onlyWhitelisted(address sender, address recipient) {
        require(
            IWhitelistOracle(whitelistOracle).isWhitelisted(sender),
            "Sender is not whitelisted"
        );
        require(
            IWhitelistOracle(whitelistOracle).isWhitelisted(recipient),
            "Recipient is not whitelisted"
        );
        _;
    }

    /**
     * @dev Internal function to update the whitelist status of a user.
     * @param userAddress Address of the user.
     * @param isWhitelisted Boolean indicating if the user is to be whitelisted or not.
     */
    function _updateTokenAccess(
        address userAddress,
        bool isWhitelisted
    ) internal {
        require(
            IWhitelistOracle(whitelistOracle).isWhitelisted(userAddress) !=
                isWhitelisted,
            "Current status matches requested status"
        );
        emit TokenAccessChanged(userAddress, isWhitelisted);
    }

    /**
     * @notice Update the whitelist status of a user.
     * @dev Only callable by an address with the whitelister role.
     * @param userAddress Address of the user.
     * @param isWhitelisted Boolean indicating if the user is to be whitelisted or not.
     */
    function updateTokenAccess(
        address userAddress,
        bool isWhitelisted
    ) external onlyRole(WHITELISTER_ROLE) {
        require(userAddress != owner(), "Cannot change owner status");
        _updateTokenAccess(userAddress, isWhitelisted);
    }

    /**
     * @notice Set a new whitelist oracle address.
     * @dev Only callable by the owner.
     * @param newWhitelistOracle Address of the new whitelist oracle.
     */
    function setWhitelistOracle(address newWhitelistOracle) external onlyOwner {
        whitelistOracle = newWhitelistOracle;
        emit WhitelistOracleUpdated(newWhitelistOracle);
    }

    /**
     * @notice Transfer tokens to a specified address.
     * @dev Both sender and recipient must be whitelisted.
     * @param recipient Address to receive the tokens.
     * @param amount Amount of tokens to be transferred.
     * @return Boolean indicating if the transfer was successful.
     */
    function transfer(
        address recipient,
        uint256 amount
    )
        public
        virtual
        override
        onlyWhitelisted(msg.sender, recipient)
        returns (bool)
    {
        return super.transfer(recipient, amount);
    }

    /**
     * @notice Transfer tokens from one address to another.
     * @dev Both sender and recipient must be whitelisted.
     * @param sender Address sending the tokens.
     * @param recipient Address to receive the tokens.
     * @param amount Amount of tokens to be transferred.
     * @return Boolean indicating if the transfer was successful.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    )
        public
        virtual
        override
        onlyWhitelisted(sender, recipient)
        returns (bool)
    {
        return super.transferFrom(sender, recipient, amount);
    }

    /**
     * @notice Mint new tokens.
     * @dev This function can only be called by the owner of the contract.
     * @param to The address that will receive the newly minted tokens.
     * @param amount The number of tokens to be minted and transferred.
     * @dev Emits a {Transfer} event with `from` set to the zero address.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Burns a specified amount of tokens from the caller's balance.
     * @dev The caller must have a sufficient balance to burn the tokens.
     * @param amount The number of tokens to be burned from the caller's balance.
     */

    function burn(uint256 amount) public {
        _burn(_msgSender(), amount);
    }
}
