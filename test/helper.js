// helper.js
async function setWhitelistStatus(oracle, account, status) {
  await oracle.setWhitelistStatus(account, status);
}

async function isWhitelisted(oracle, account) {
  return oracle.isWhitelisted(account);
}

module.exports = {
  setWhitelistStatus,
  isWhitelisted,
};
