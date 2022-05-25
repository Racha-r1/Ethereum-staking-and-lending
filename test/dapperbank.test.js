const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const Dapperbank = artifacts.require("./DapperBank.sol");
const Dai = artifacts.require("./Dai.sol");
const USDC = artifacts.require("./USDC.sol");
const DPK = artifacts.require("./DPK.sol");
const truffleAssert = require('truffle-assertions');

contract("Dapperbank", (accounts) => {
    
    let dapperbankContract, daiContract, usdcContract, dpkContract;

    before(async () => {
        dapperbankContract = await Dapperbank.deployed();
        daiContract = await Dai.deployed();
        usdcContract = await USDC.deployed();
        dpkContract = await DPK.deployed();
    });

    it("should have the dapperbank tokens", async() => {
        const dapperbankBalance = await dpkContract.balanceOf(dapperbankContract.address);
        assert.equal(dapperbankBalance, web3.utils.toWei('1000000', 'ether'));
    });


    describe("Check if funds are transferred to accounts[1]", async() => {
        it("Account should have DAI", async() => {
            const balance = await daiContract.balanceOf.call(accounts[1]);
            assert.equal(balance.toString(), web3.utils.toWei('1000000', 'ether'));
        });

        it("Account should have USDC", async() => {
            const balance = await usdcContract.balanceOf.call(accounts[1]);
            assert.equal(balance.toString(), web3.utils.toWei('1000000', 'ether'));
        });
    })

    describe("Check if staking tokens works properly", async() => {
        it("Should stake the token to the contract if token is supported", async() => {
            const amount = web3.utils.toWei('10', 'ether');
            await daiContract.approve(dapperbankContract.address, amount , {from: accounts[1]});
            await dapperbankContract.stake(amount,daiContract.address, {from: accounts[1]});
            const staked_obj = await dapperbankContract.stakedBalances.call(daiContract.address, accounts[1]);
            assert.equal(staked_obj.amount.toString(), amount);
        });

        it("Should not stake the token to the contract if token is not supported", async() => {
            const ERROR_MSG = "The token is not an asset that our contract supports";
            const amount = web3.utils.toWei('10', 'ether');
            await dpkContract.approve(dapperbankContract.address, amount , {from: accounts[1]});
            await truffleAssert.reverts(dapperbankContract.stake(amount, dpkContract.address, {from: accounts[1]}),ERROR_MSG);
        });
    });

    describe("Check if unstaking tokens works properly", async() => {
        it("Should unstake the token to the contract if token is supported", async() => {
            const balance = await daiContract.balanceOf.call(accounts[1]);
            await dapperbankContract.unstake(daiContract.address, {from: accounts[1]});
            const staked_obj = await dapperbankContract.stakedBalances.call(daiContract.address, accounts[1]);
            const newbalance = await daiContract.balanceOf.call(accounts[1]);
            assert.equal(staked_obj.amount.toString(), 0);
            expect(parseInt(balance)).to.be.lessThan(parseInt(newbalance));
        });

        it("Should not unstake the token to the contract if token is not supported", async() => {
            const ERROR_MSG = "The token is not an asset that our contract supports";
            await truffleAssert.reverts(dapperbankContract.unstake(dpkContract.address, {from: accounts[1]}),ERROR_MSG);
        });
    });

     describe("Adding token to assets", async() => {
        it("Should add token to assets if called from owner address", async() => {
            await dapperbankContract.addTokenToAssets(dpkContract.address, {from: accounts[0]});
            const assets = await dapperbankContract.getAssets.call();
            assert.equal(assets.length, 13);
            assert.equal(assets[12], dpkContract.address);
        });

        it("Should not add token to assets if called from an other address than the owner", async() => {
            const ERROR_MSG = "Only the owner is allowed to perform this operation";
            await truffleAssert.reverts(dapperbankContract.addTokenToAssets(dpkContract.address, {from: accounts[1]}),ERROR_MSG);
            const assets = await dapperbankContract.getAssets.call();
            assert.equal(assets.length, 13);
        });
    })

    describe("Check if token is in assets", async() => {
        it("Should return true if token is in assets", async() => {
            const inAssets = await dapperbankContract.inAssets.call(daiContract.address);
            assert.equal(inAssets, true);
        });

        it("Should return false if token is not in assets", async() => {
            const inAssets = await dapperbankContract.inAssets.call("0xc0ffee254729296a45a3885639AC7E10F9d54979");
            assert.equal(inAssets, false);
        });
    });

    describe("Check if contract can mint tokens dpk tokens", async() => {
        it("Dapperbank contract should be able to mint dpk tokens", async() => {
            await dapperbankContract.mintTokens(dapperbankContract.address, web3.utils.toWei('100', 'ether'), {from: accounts[0]});
            const balance = await dpkContract.balanceOf.call(dapperbankContract.address);
            assert.equal(balance.toString(), web3.utils.toWei('1000100', 'ether'));
        });
    });
    // describe("Check if contract can mint tokens dpk tokens", async() => {
        
    //     it("Should be able the claim rewards after the reward period" , async() => {
    //         // staking
    //         const amount = web3.utils.toWei('10', 'ether');
    //         await daiContract.approve(dapperbankContract.address, amount , {from: accounts[1]});
    //         await dapperbankContract.stake(amount,daiContract.address, {from: accounts[1]});
    //         setTimeout(async() => {
    //             // claim rewards
    //             await dapperbankContract.claimRewards({from: accounts[1]});

    //         }, 60000);
    //         const staked_obj = await dapperbankContract.stakedBalances.call(daiContract.address, accounts[1]);
    //         assert.equal(staked_obj.amount.toString(), amount);
    //     });
    // });
});