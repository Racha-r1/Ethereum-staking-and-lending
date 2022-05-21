import { Contract, ethers, providers, Signer } from "ethers";
import DapperBank from "../contracts/DapperBank.json";
import Stake from './Stake';

const networkId: string = '5777';

const stake = async(tokenContract: Contract, amount: string , signer: Signer) => {
    const weiAmount = ethers.utils.parseEther(amount);
    const dapperbankContract: Contract = new ethers.Contract(DapperBank.networks[networkId].address, DapperBank.abi, signer);
    await tokenContract.approve(dapperbankContract.address, weiAmount);
    await dapperbankContract.stake(weiAmount, tokenContract.address);
}

const getAmountOfTokensStaked = async(tokenContract: Contract, signer: Signer) : Promise<Stake> => {
    const account_address: string = await signer.getAddress();
    const dapperbankContract = new ethers.Contract(DapperBank.networks[networkId].address, DapperBank.abi, signer);
    return await dapperbankContract.stakedBalances(tokenContract.address, account_address);
}

const unstake = async(tokenContract: Contract , signer: Signer) => {
    const dapperbankContract: Contract = new ethers.Contract(DapperBank.networks[networkId].address, DapperBank.abi, signer);
    return await dapperbankContract.unstake(tokenContract.address);
}

const claimReward = async(tokenContract: Contract, signer: Signer) => {
    const dapperbankContract: Contract = new ethers.Contract(DapperBank.networks[networkId].address, DapperBank.abi, signer);
    return await dapperbankContract.claimReward(tokenContract.address);
}

export {
    stake,
    unstake,
    claimReward,
    getAmountOfTokensStaked
}