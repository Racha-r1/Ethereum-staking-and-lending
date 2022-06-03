import { Contract, ethers, providers, Signer, EventFilter } from "ethers";
import DapperBank from "../contracts/DapperBank.json";
import Stake from './Stake';

const networkId: string = '5777';

const stake = async(tokenContract: Contract, amount: string , signer: Signer) => {
    const weiAmount = ethers.utils.parseEther(amount);
    const dapperbankContract: Contract = new ethers.Contract(DapperBank.networks[networkId].address, DapperBank.abi, signer);
    await tokenContract.approve(dapperbankContract.address, weiAmount);
    const transaction = await dapperbankContract.stake(weiAmount, tokenContract.address);
    const receipt = await transaction.wait();
    return receipt;
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

const getTransactionHistory = async(signer: Signer) => {
    const dapperbankContract: Contract = new ethers.Contract(DapperBank.networks[networkId].address, DapperBank.abi, signer);
    const stakedFilter: EventFilter = dapperbankContract.filters.Staked();
    const unstakedFiler: EventFilter = dapperbankContract.filters.Unstaked();
    const stakedEvents = await dapperbankContract.queryFilter(stakedFilter);
    const unstakedEvents = await dapperbankContract.queryFilter(unstakedFiler);
    return [...stakedEvents, ...unstakedEvents];
}

export {
    stake,
    unstake,
    claimReward,
    getAmountOfTokensStaked,
    getTransactionHistory
}