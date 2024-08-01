# Whitelist Controlled Token

The WhitelistControlledToken contract is an ERC20 token with restricted transfer functionality based on a whitelist oracle. Only addresses listed on the whitelist can transfer or receive tokens. The contract provides functionalities for minting, burning, and managing the whitelist.

## Component Overview

![image](https://github.com/user-attachments/assets/645d72e9-324c-43ab-bb02-3cf9b350c2d4)

## Edge Cases

1. Data Latency
- Delays in whitelist updates can lead unfacilitated transfers to blacklisted addresses
- Possible Solution
  - Validate data freshness by incorporating time-based checks. 
  - Alerts on downtime of the oracle updates
  - Logging the update timings to get a hawkeye view of the latency

2. Incorrect Access Control
- Preventing unauthorized access which could lead to user's access being compromised
- Possible Solution
  - Implement granular access controls for different oracle functions and data.
  - Protect credentials and keys using secure storage methods.

3. Smart Contract Compatibility
- Ensuring seamless interaction between the oracle interface and the smart contract.
- Possible Solution
    - Maintain compatibility through versioning and backward compatibility features.

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
- Whitelisting account: Successfully emitting event & adding an account to the whitelist through the oracle.
- Receiving after whitelisting: Enabling receiving after whitelisting the account.
- Sending after whitelisting: Enabling sending after whitelisting the account.
- Blacklisting account: Successfully emitting event & removing an account from the whitelist through the oracle.
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


