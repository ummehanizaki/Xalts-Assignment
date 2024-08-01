const { ethers } = require("hardhat");

async function deploy() {
  try {
    const [
      contractOwner,
      account1,
      account2,
      account3,
      account4,
      account5,
      keeper,
    ] = await ethers.getSigners();
    console.log("Contract Owner:", contractOwner.address);
    console.log("Account 1:", account1.address);
    console.log("Account 2:", account2.address);
    console.log("Account 3:", account3.address);
    console.log("Account 4:", account4.address);
    console.log("Account 5:", account5.address);
    console.log("Keeper:", keeper.address);
    const amount = ethers.utils.parseUnits("1", "ether");

    // Fetch contracts
    const [ManagedToken, WhitelistOracle] = await Promise.all([
      ethers.getContractFactory("ManagedToken"),
      ethers.getContractFactory("WhitelistOracle"),
    ]);

    // Deploy WhitelistOracle
    const whitelistOracle = await WhitelistOracle.deploy();
    await whitelistOracle.deployed();
    console.log("WhitelistOracle deployed:", whitelistOracle.address);

    // Deploy ManagedToken
    const managedToken = await ManagedToken.deploy(
      [
        contractOwner.address,
        account1.address,
        account2.address,
        account3.address,
        account4.address,
      ],
      whitelistOracle.address
    );
    await managedToken.deployed();

    console.log("ManagedToken deployed:", managedToken.address);

    await (
      await whitelistOracle.setWhitelistStatus(contractOwner.address, true)
    ).wait();
    await (
      await whitelistOracle.setWhitelistStatus(account1.address, true)
    ).wait();
    await (
      await whitelistOracle.setWhitelistStatus(account2.address, true)
    ).wait();
    await (
      await whitelistOracle.setWhitelistStatus(account3.address, true)
    ).wait();
    await (
      await whitelistOracle.setWhitelistStatus(account4.address, true)
    ).wait();

    const a = await whitelistOracle.isWhitelisted(account2.address);
    console.log("Account 2 whitelisted:", a);

    // Return deployed contracts
    return {
      contractOwner,
      managedToken,
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
