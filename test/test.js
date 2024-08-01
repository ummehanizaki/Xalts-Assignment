const { deploy } = require("../scripts/deploy");
const { assert, expect } = require("chai");
const { setWhitelistStatus, isWhitelisted } = require("./helper");

describe("Whitelist Controlled Token Tests", function () {
  let contractOwner,
    whitelistControlledToken,
    whitelistOracle,
    account2,
    account4,
    account5,
    amount;

  before(async function () {
    ({
      contractOwner,
      whitelistControlledToken,
      whitelistOracle,
      account1,
      account2,
      account3,
      account4,
      account5,
      amount,
    } = await deploy());
  });

  beforeEach(async function () {
    await whitelistControlledToken.mint(contractOwner.address, amount);
  });

  async function mintAndTransfer(sender, recipient, amount) {
    await whitelistControlledToken.mint(sender.address, amount);
    await whitelistControlledToken.transfer(recipient.address, amount);
  }

  it("Allows whitelisted addresses to transfer tokens", async function () {
    await mintAndTransfer(contractOwner, account2, amount);
    const balance = await whitelistControlledToken.balanceOf(account2.address);
    assert.equal(
      balance.toString(),
      amount.toString(),
      "Account 2 should have the transferred amount"
    );
  });

  it("Prevents non-whitelisted addresses from receiving tokens", async function () {
    await expect(
      whitelistControlledToken.transfer(account5.address, amount)
    ).to.be.revertedWith("Recipient is not whitelisted");
  });

  it("Allows whitelisting an account", async function () {
    const tx = await whitelistControlledToken.updateTokenAccess(
      account5.address,
      true
    );
    const receipt = await tx.wait();
    // Find the event in the transaction receipt
    const event = receipt.events.find(
      (event) => event.event === "TokenAccessChanged"
    );
    expect(event.args.userAddress).to.equal(account5.address); // Verify 'userAddress'
    expect(event.args.isWhitelisted).to.be.true;

    await setWhitelistStatus(whitelistOracle, account5.address, true);
    const isWhitelistedStatus = await isWhitelisted(
      whitelistOracle,
      account5.address
    );
    expect(isWhitelistedStatus).to.be.true;
  });

  it("Allows receiving tokens after whitelisting an account", async function () {
    await mintAndTransfer(contractOwner, account5, amount);
    const balance = await whitelistControlledToken.balanceOf(account5.address);
    assert.equal(
      balance.toString(),
      amount.toString(),
      "Account 5 should have the transferred amount after whitelisting"
    );
  });

  it("Allows sending tokens after whitelisting an account", async function () {
    await whitelistControlledToken
      .connect(account5)
      .transfer(account4.address, amount);
    const balance = await whitelistControlledToken.balanceOf(account4.address);
    assert.equal(
      balance.toString(),
      amount.toString(),
      "Account 4 should have the transferred amount"
    );
  });

  it("Blacklists an account", async function () {
    const tx = await whitelistControlledToken.updateTokenAccess(
      account5.address,
      false
    );
    const receipt = await tx.wait();
    // Find the event in the transaction receipt
    const event = receipt.events.find(
      (event) => event.event === "TokenAccessChanged"
    );
    expect(event.args.userAddress).to.equal(account5.address); // Verify 'userAddress'
    expect(event.args.isWhitelisted).to.be.false;

    await setWhitelistStatus(whitelistOracle, account5.address, false);
    const isWhitelistedStatus = await isWhitelisted(
      whitelistOracle,
      account5.address
    );
    expect(isWhitelistedStatus).to.be.false;
  });

  it("Prevents sending tokens after blacklisting an account", async function () {
    await expect(
      whitelistControlledToken
        .connect(account5)
        .transfer(account2.address, amount)
    ).to.be.revertedWith("Sender is not whitelisted");
  });
});
