const { ethers } = require("hardhat");

async function deploy() {
  try {
    // Retrieve signers
    const [
      contractOwner,
      account1,
      account2,
      account3,
      account4,
      account5,
      keeper,
    ] = await ethers.getSigners();

    // Log addresses
    console.log("Contract Owner:", contractOwner.address);
    console.log("Account 1:", account1.address);
    console.log("Account 2:", account2.address);
    console.log("Account 3:", account3.address);
    console.log("Account 4:", account4.address);
    console.log("Account 5:", account5.address);
    console.log("Keeper:", keeper.address);

    // Define amount
    const amount = ethers.utils.parseUnits("1", "ether");

    // Fetch contract factories
    const WhitelistControlledToken = await ethers.getContractFactory(
      "WhitelistControlledToken"
    );
    const DummyWhitelistOracle = await ethers.getContractFactory(
      "DummyWhitelistOracle"
    );

    // Deploy DummyWhitelistOracle
    const whitelistOracle = await DummyWhitelistOracle.deploy();
    await whitelistOracle.deployed();
    console.log("DummyWhitelistOracle deployed:", whitelistOracle.address);

    // Deploy WhitelistControlledToken
    const whitelistControlledToken = await WhitelistControlledToken.deploy(
      [
        contractOwner.address,
        account1.address,
        account2.address,
        account3.address,
        account4.address,
      ],
      whitelistOracle.address
    );
    await whitelistControlledToken.deployed();
    console.log(
      "WhitelistControlledToken deployed:",
      whitelistControlledToken.address
    );

    // Set whitelist status
    const whitelistStatusPromises = [
      whitelistOracle.setWhitelistStatus(contractOwner.address, true),
      whitelistOracle.setWhitelistStatus(account1.address, true),
      whitelistOracle.setWhitelistStatus(account2.address, true),
      whitelistOracle.setWhitelistStatus(account3.address, true),
      whitelistOracle.setWhitelistStatus(account4.address, true),
    ];
    await Promise.all(whitelistStatusPromises);

    // Check whitelist status
    const isAccount2Whitelisted = await whitelistOracle.isWhitelisted(
      account2.address
    );
    console.log("Account 2 whitelisted:", isAccount2Whitelisted);

    // Return deployed contracts and relevant information
    return {
      contractOwner,
      whitelistControlledToken,
      whitelistOracle,
      account1,
      account2,
      account3,
      account4,
      account5,
      keeper,
      amount,
    };
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  deploy();
}

exports.deploy = deploy;
