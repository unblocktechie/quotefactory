const Quote = artifacts.require("Quote");
const Trade = artifacts.require("Trade");

module.exports = async function(deployer) {
  // Deploy Quote
  await deployer.deploy(Quote);
  const quote = await Quote.deployed()

  // Deploy Trade
  await deployer.deploy(Trade, quote.address);
  const trade = await Trade.deployed()
};
