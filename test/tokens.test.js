// SPDX-License-Identifier: MIT

/**
 * For the sake of simplicity we are only testing 2 tokens since they all have the same functionality.
 * We will use the dai token and USDC coin for our tests.
 */
 const Dai = artifacts.require("./Dai.sol");
 const USDC = artifacts.require("./USDC.sol");
 
contract("DAI", (accounts) => {
    let dai;
 
    before(async() => {
        dai = await Dai.deployed();
    });
 
    it("Should have a name", async() => {
        const name = await dai.name.call();
        assert.equal(name, "DAI");
    });
 
    it("Should have a symbol", async() => {
        const symbol = await dai.symbol.call();
        assert.equal(symbol, "DAI");
    });
     
    it("Should have an initial supply of 1000000 tokens", async() => {
        const initialSupply = await dai.totalSupply.call();
        assert.equal(initialSupply.toString(), web3.utils.toWei('1000000', 'ether'));
    });
 
    it("Should mint 100 tokens extra", async() => {
        await dai.mint(accounts[0], web3.utils.toWei('100', 'ether'), {from: accounts[0]});
        const supply = await dai.totalSupply.call();
        assert.equal(supply.toString(), web3.utils.toWei('1000100', 'ether'));
    });
 
    it("Should burn 100 tokens", async() => {
        await dai.burn(web3.utils.toWei('100', 'ether'), {from: accounts[0]});
        const supply = await dai.totalSupply.call();
        assert.equal(supply.toString(), web3.utils.toWei('1000000', 'ether'));
    });
});
 
contract("USDC", (accounts) => {
    let usdc;
 
    before(async() => {
        usdc = await USDC.deployed();
    });
 
    it("Should have a name", async() => {
        const name = await usdc.name.call();
        assert.equal(name, "USD Coin");
    });
 
    it("Should have a symbol", async() => {
        const symbol = await usdc.symbol.call();
        assert.equal(symbol, "USDC");
    });
     
    it("Should have an initial supply of 1000000 tokens", async() => {
        const initialSupply = await usdc.totalSupply.call();
        assert.equal(initialSupply.toString(), web3.utils.toWei('1000000', 'ether'));
    });
 
    it("Should mint 100 tokens extra", async() => {
        await usdc.mint(accounts[0], web3.utils.toWei('100', 'ether'), {from: accounts[0]});
        const supply = await usdc.totalSupply.call();
        assert.equal(supply.toString(), web3.utils.toWei('1000100', 'ether'));
    });
 
    it("Should burn 100 tokens", async() => {
        await usdc.burn(web3.utils.toWei('100', 'ether'), {from: accounts[0]});
        const supply = await usdc.totalSupply.call();
        assert.equal(supply.toString(), web3.utils.toWei('1000000', 'ether'));
    });
     
});