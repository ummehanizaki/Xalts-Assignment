# Whitelist Controlled Token

The WhitelistControlledToken contract is an ERC20 token with restricted transfer functionality based on a whitelist oracle. Only addresses listed on the whitelist can transfer or receive tokens. The contract provides functionalities for minting, burning, and managing the whitelist.

## Dependencies

1. OpenZeppelin Contracts: ERC20, Ownable, AccessControl
2. IWhitelistOracle interface

## Installation

To get started with the WhitelistControlledToken, follow these steps:

1. Clone the repository:

```console
git clone git@github.com:ummehanizaki/Xalts-Assignment.git
```

2. Navigate to the project directory and install the necessary NPM packages::

```console
cd Xalts-Assignment
npm install
```

## Running Tests

To ensure the functionality of various components, run the following command:

```console
npx hardhat test
```

### Testing Overview

The test suite covers the core functionalities of the WhitelistControlledToken contract, focusing on whitelist-based transfer restrictions.

Key Tests:

- Transfer between whitelisted addresses: Successful transfer between pre-whitelisted accounts.
- Blacklisted recipient rejection: Transfer rejection when the recipient is not whitelisted.
- Whitelisting account: Successfully adding an account to the whitelist through the oracle.
- Receiving after whitelisting: Enabling receiving after whitelisting the account.
- Sending after whitelisting: Enabling sending after whitelisting the account.
- Blacklisting account: Successfully removing an account from the whitelist through the oracle.
- Sending after blacklisting: Transfer rejection when the sender is blacklisted.

Overall, the tests demonstrate that the whitelist mechanism effectively controls token transfers and ensures compliance with the intended access restrictions.

## Deployment

Deploy the contracts using the following command:

```console
npx hardhat run scripts/deploy.js
```

### Deployment Overview

- `WhitelistControlledToken`: Enables transfers only between whitelisted addresses
- `WhitelistOracle`: Maintains a whitelist of the token.
