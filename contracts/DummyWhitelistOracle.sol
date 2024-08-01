// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DummyWhitelistOracle is AccessControl {
    bytes32 public constant WHITELISTER_ROLE = keccak256("WHITELISTER_ROLE");

    // Mapping to store the whitelist status
    mapping(address => bool) private _whitelist;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(WHITELISTER_ROLE, msg.sender);
    }

    modifier onlyWhitelister() {
        require(
            hasRole(WHITELISTER_ROLE, msg.sender),
            "Caller is not a whitelister"
        );
        _;
    }

    /**
     * @dev Sets the whitelist status for an address.
     * Emits a {WhitelistStatusChanged} event.
     * @param account The address to update the whitelist status for.
     * @param status The new whitelist status (true or false).
     */
    function setWhitelistStatus(
        address account,
        bool status
    ) external onlyRole(WHITELISTER_ROLE) {
        require(account != address(0), "Cannot whitelist zero address");
        if (_whitelist[account] != status) {
            _whitelist[account] = status;
        }
    }

    /**
     * @dev Checks if an address is whitelisted.
     * @param account The address to check.
     * @return bool Whether the address is whitelisted.
     */
    function isWhitelisted(address account) external view returns (bool) {
        return _whitelist[account];
    }
}
