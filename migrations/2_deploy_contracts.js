const Dai = artifacts.require("./tokens/DAI.sol");
const USDC = artifacts.require("./tokens/USDC.sol");
const DPK = artifacts.require("./tokens/DPK.sol");
const BAT = artifacts.require("./tokens/BAT.sol");
const CAKE = artifacts.require("./tokens/CAKE.sol");
const FLOW = artifacts.require("./tokens/FLOW.sol");
const COMP = artifacts.require("./tokens/COMP.sol");
const LINK = artifacts.require("./tokens/LINK.sol");
const SUSHI = artifacts.require("./tokens/SUSHI.sol");
const UNI = artifacts.require("./tokens/UNI.sol");
const USDT = artifacts.require("./tokens/USDT.sol");
const YFI = artifacts.require("./tokens/YFI.sol");
const ZRX = artifacts.require("./tokens/ZRX.sol");
const AAVE = artifacts.require("./tokens/AAVE.sol");
const Dapperbank = artifacts.require("./Dapperbank.sol");
const PriceConsumerV3 = artifacts.require("./PriceConsumerV3.sol");

module.exports = async function (deployer, network, accounts) {
    // deploy the tokens
    await deployer.deploy(Dai);
    await deployer.deploy(USDC);
    await deployer.deploy(BAT);
    await deployer.deploy(CAKE);
    await deployer.deploy(FLOW);
    await deployer.deploy(COMP);
    await deployer.deploy(LINK);
    await deployer.deploy(SUSHI);
    await deployer.deploy(UNI);
    await deployer.deploy(USDT);
    await deployer.deploy(YFI);
    await deployer.deploy(ZRX);
    await deployer.deploy(PriceConsumerV3);
    await deployer.deploy(AAVE);
    await deployer.deploy(DPK);

    // get the deployed contracts
    const daiContract = await Dai.deployed();
    const usdcContract = await USDC.deployed();
    const batContract = await BAT.deployed();
    const cakeContract = await CAKE.deployed();
    const flowContract = await FLOW.deployed();
    const compContract = await COMP.deployed();
    const linkContract = await LINK.deployed();
    const sushiContract = await SUSHI.deployed();
    const uniContract = await UNI.deployed();
    const usdtContract = await USDT.deployed();
    const yfiContract = await YFI.deployed();
    const zrxContract = await ZRX.deployed();
    const dpkContract = await DPK.deployed();
    const aaveContract = await AAVE.deployed();
    const priceConsumerV3Contract = await PriceConsumerV3.deployed();
    await deployer.deploy(Dapperbank,dpkContract.address);
    const dapperbankContract = await Dapperbank.deployed();
    dpkContract.transferOwnership(dapperbankContract.address, {from: accounts[0]});


    // add the tokens to the assets
    await dapperbankContract.addTokenToAssets(daiContract.address);
    await dapperbankContract.addTokenToAssets(usdcContract.address);
    await dapperbankContract.addTokenToAssets(batContract.address);
    await dapperbankContract.addTokenToAssets(cakeContract.address);
    await dapperbankContract.addTokenToAssets(flowContract.address);
    await dapperbankContract.addTokenToAssets(compContract.address);
    await dapperbankContract.addTokenToAssets(linkContract.address);
    await dapperbankContract.addTokenToAssets(sushiContract.address);
    await dapperbankContract.addTokenToAssets(uniContract.address);
    await dapperbankContract.addTokenToAssets(usdtContract.address);
    await dapperbankContract.addTokenToAssets(yfiContract.address);
    await dapperbankContract.addTokenToAssets(zrxContract.address);
    await dapperbankContract.addTokenToAssets(zrxContract.address);
    await dapperbankContract.addTokenToAssets(aaveContract.address);

    // transfer the dapperbank tokens to the dapperbank contract and pass the other tokens to accounts[1] which will act as our investor
    await dpkContract.transfer(
        dapperbankContract.address,
        web3.utils.toWei("1000000", "ether"),
        { from: accounts[0] }
    );
    await usdcContract.transfer(
        accounts[1],
        web3.utils.toWei("500000", "ether"),
        { from: accounts[0] }
    );

    await usdcContract.transfer(
        accounts[2],
        web3.utils.toWei("500000", "ether"),
        { from: accounts[0] }
    );
    await aaveContract.transfer(
        accounts[1],
        web3.utils.toWei("1000000", "ether"),
        { from: accounts[0] }
    );
    await daiContract.transfer(
        accounts[1],
        web3.utils.toWei("1000000", "ether"),
        { from: accounts[0] }
    );
    await batContract.transfer(
        accounts[1],
        web3.utils.toWei("1000000", "ether"),
        { from: accounts[0] }
    );
    await cakeContract.transfer(
        accounts[1],
        web3.utils.toWei("1000000", "ether"),
        { from: accounts[0] }
    );
    await flowContract.transfer(
        accounts[1],
        web3.utils.toWei("1000000", "ether"),
        { from: accounts[0] }
    );
    await compContract.transfer(
        accounts[1],
        web3.utils.toWei("1000000", "ether"),
        { from: accounts[0] }
    );
    await linkContract.transfer(
        accounts[1],
        web3.utils.toWei("1000000", "ether"),
        { from: accounts[0] }
    );
    await sushiContract.transfer(
        accounts[1],
        web3.utils.toWei("1000000", "ether"),
        { from: accounts[0] }
    );
    await uniContract.transfer(
        accounts[1],
        web3.utils.toWei("1000000", "ether"),
        { from: accounts[0] }
    );
    await usdtContract.transfer(
        accounts[1],
        web3.utils.toWei("1000000", "ether"),
        { from: accounts[0] }
    );
    await yfiContract.transfer(
        accounts[1],
        web3.utils.toWei("1000000", "ether"),
        { from: accounts[0] }
    );
    await zrxContract.transfer(
        accounts[1],
        web3.utils.toWei("1000000", "ether"),
        { from: accounts[0] }
    );
};
