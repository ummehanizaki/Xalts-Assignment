const { deploy } = require("../scripts/deploy");
const { assert, expect } = require("chai");

describe("Managed Token tests", async function () {
  let contractOwner;
  let managedToken;
  let whitelistOracle;
  let account1;
  let account2;
  let account3;
  let account4;
  let account5;
  let keeper;
  let amount;

  before(async function () {
    ({
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
    } = await deploy());
  });

  it("Whitelisted addresses should be able to transfer tokens to each other", async function () {
    assert.equal(
      (await managedToken.balanceOf(account2.address)).toString(),
      "0"
    );
    await managedToken.mint(contractOwner.address, amount);
    await managedToken.transfer(account2.address, amount);
    assert.equal(
      (await managedToken.balanceOf(account2.address)).toString(),
      amount
    );
  });

  it("Addresses not whitelisted should not be able to receive tokens", async function () {
    await managedToken.mint(contractOwner.address, amount);
    await expect(
      managedToken.transfer(account5.address, amount)
    ).to.be.revertedWith("Receiver is not whitelisted");
  });

  it("Whitelist Account", async function () {
    await managedToken.toggleTokenAccess(account5.address, true);
    await whitelistOracle.setWhitelistStatus(account5.address, true);
    expect(await whitelistOracle.isWhitelisted(account5.address)).to.equal(
      true
    );
  });

  it("Enable receiving after Whitelisting Account", async function () {
    assert.equal(
      (await managedToken.balanceOf(account5.address)).toString(),
      "0"
    );
    await managedToken.mint(contractOwner.address, amount);
    await managedToken.transfer(account5.address, amount);
    assert.equal(
      (await managedToken.balanceOf(account5.address)).toString(),
      amount
    );
  });

  it("Enable sending after Whitelisting Account", async function () {
    assert.equal(
      (await managedToken.balanceOf(account4.address)).toString(),
      "0"
    );
    await managedToken.connect(account5).transfer(account4.address, amount);

    // await managedToken.transfer(account5.address, amount);
    assert.equal(
      (await managedToken.balanceOf(account4.address)).toString(),
      amount
    );
  });

  it("Blacklist Account", async function () {
    await managedToken.toggleTokenAccess(account5.address, false);
    await whitelistOracle.setWhitelistStatus(account5.address, false);

    expect(await whitelistOracle.isWhitelisted(account5.address)).to.equal(
      false
    );
  });

  it("Disable sending after Blacklisting Account", async function () {
    await expect(
      managedToken.connect(account5).transfer(account2.address, amount)
    ).to.be.revertedWith("Sender is not whitelisted");
  });

  it("Disable receiving after Blacklisting Account", async function () {
    await expect(
      managedToken.transfer(account5.address, amount)
    ).to.be.revertedWith("Receiver is not whitelisted");
  });
});
