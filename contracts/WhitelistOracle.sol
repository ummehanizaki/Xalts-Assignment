// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract WhitelistOracle {
    // Mapping to store the whitelist status of addresses
    mapping(address => bool) private whitelisted;

    // Owner of the contract
    address private owner;

    // Modifier to restrict function access to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    // Event to log white changes
    event WhitelistStatusChanged(address indexed _address, bool _status);

    // Constructor to set the owner of the contract
    constructor() {
        owner = msg.sender;
    }

    // Function to add or remove an address from the whitelist
    function setWhitelistStatus(
        address _address,
        bool _status
    ) public onlyOwner {
        whitelisted[_address] = _status;
        emit WhitelistStatusChanged(_address, _status);
    }

    // View function to check if an address is whitelisted
    function isWhitelisted(address _address) public view returns (bool) {
        return whitelisted[_address];
    }
}
