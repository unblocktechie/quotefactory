const Quote = artifacts.require('./Quote.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Quote', (accounts) => {
  let contract

  before(async () => {
    contract = await Quote.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await contract.name()
      assert.equal(name, 'Quote')
    })

    it('has a symbol', async () => {
      const symbol = await contract.symbol()
      assert.equal(symbol, 'QUOTE')
    })

  })

  describe('minting', async () => {

    it('creates a new token', async () => {
      const result = await contract.mint('hello world')
      const totalSupply = await contract.totalSupply()
      // SUCCESS
      assert.equal(totalSupply, 1)
      const event = result.logs[0].args
      assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct')

      // FAILURE: cannot mint same quote twice
      await contract.mint('hello world').should.be.rejected;
    })
  })

  describe('indexing', async () => {
    it('lists quotes', async () => {
      // Mint 3 more tokens
      await contract.mint('foo')
      await contract.mint('bar')
      await contract.mint('whatever')
      const totalSupply = await contract.totalSupply()

      let quote
      let result = []

      for (var i = 1; i <= totalSupply; i++) {
        quote = await contract.quotes(i - 1)
        result.push(quote)
      }

      let expected = ['hello world', 'foo', 'bar', 'whatever']
      assert.equal(result.join(','), expected.join(','))
    })
  })

})
