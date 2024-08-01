// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IManagedToken {
    // Events
    event TokenAccessToggled(address indexed userAddress, bool isWhitelisted);
}
