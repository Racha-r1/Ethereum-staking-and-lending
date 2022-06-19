import { Contract, ethers, Signer, EventFilter } from "ethers";
import DapperBank from "../contracts/DapperBank.json";
import Stake from './Stake';
import Event from './Event';

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

const unstake = async(tokenContract: Contract , signer: Signer, amount: number) => {
    const weiAmount = ethers.utils.parseEther(amount.toString());
    const dapperbankContract: Contract = new ethers.Contract(DapperBank.networks[networkId].address, DapperBank.abi, signer);
    return await dapperbankContract.unstake(tokenContract.address, weiAmount);
}

const giveRewards = async(tokenContracts: Contract[], signer: Signer) => {
    const dapperbankContract: Contract = new ethers.Contract(DapperBank.networks[networkId].address, DapperBank.abi, signer);
    return await dapperbankContract.claimRewards(tokenContracts);
}

const getTransactionHistory = async(signer: Signer) => {
    const dapperbankContract: Contract = new ethers.Contract(DapperBank.networks[networkId].address, DapperBank.abi, signer);
    const stakedFilter: EventFilter = dapperbankContract.filters.Staked();
    const unstakedFiler: EventFilter = dapperbankContract.filters.Unstaked();
    const borrowedFilter: EventFilter = dapperbankContract.filters.Borrowed();
    const repaidFilter: EventFilter = dapperbankContract.filters.Repaid();
    const stakedEvents = await dapperbankContract.queryFilter(stakedFilter);
    const unstakedEvents = await dapperbankContract.queryFilter(unstakedFiler);
    const borrowedEvents = await dapperbankContract.queryFilter(borrowedFilter);
    const repaidEvents = await dapperbankContract.queryFilter(repaidFilter);
    return [...stakedEvents, ...unstakedEvents, ...borrowedEvents, ...repaidEvents];
}

const getTokenBalance = async(tokenAddress: string, signer: Signer) => {
    const dapperbankContract: Contract = new ethers.Contract(DapperBank.networks[networkId].address, DapperBank.abi, signer);
    return await dapperbankContract.tokenBalances(tokenAddress);
}

async function getHistory(account: string) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer: Signer = provider.getSigner();
    const results = await getTransactionHistory(signer);
    console.log(results);
    const signatureStakedEvent = "Staked(address,string,uint,uint256)";
    const signatureUnstakedEvent = "Unstaked(address,string,uint,uint256)";
    const signatureBorrowedEvent = "Borrowed(address,string,uint,uint256)";
    const signatureRepaidEvent = "Repaid(address,uint,bool,uint256,string)";
    const transactions: Event[] = [];
    results.forEach(async (result) => {
        if (result.args) {
            const amount = parseInt(
                ethers.utils.formatEther(
                    result.args["amount"].toString()
                )
            );
            const d = new Date(
                parseInt(result.args["timestamp"]) * 1000
            );
            if (result.event === "Staked") {
                const stakedBytes: Uint8Array =
                    ethers.utils.toUtf8Bytes(signatureStakedEvent);
                ethers.utils.keccak256(stakedBytes);
                const token = ethers.utils.defaultAbiCoder
                    .decode(["string"], result.data)[0]
                    .toString();
                if (result.args["investor"].toString().toLowerCase() === account){
                    transactions.push({
                        amount: amount,
                        investor: result.args["investor"],
                        token: token,
                        type: result.event,
                        date: d,
                    });
                }
            }
            if (result.event === "Unstaked") {
                const unstakedBytes: Uint8Array =
                    ethers.utils.toUtf8Bytes(signatureUnstakedEvent);
                ethers.utils.keccak256(unstakedBytes);
                const token = ethers.utils.defaultAbiCoder
                    .decode(["string"], result.data)[0]
                    .toString();
                if (result.args["investor"].toString().toLowerCase() === account){
                    transactions.push({
                            amount: amount,
                            investor: result.args["investor"],
                            token: token,
                            type: result.event,
                            date: d,
                        });
                    }
                }
            if (result.event === "Borrowed") {
                const borrowedBytes: Uint8Array = ethers.utils.toUtf8Bytes(signatureBorrowedEvent);
                ethers.utils.keccak256(borrowedBytes);
                const token = ethers.utils.defaultAbiCoder.decode(["string"], result.data)[0].toString();
                if (result.args["issuer"].toString().toLowerCase() === account){
                    transactions.push({
                        amount: amount,
                        investor: result.args["issuer"],
                        token: token,
                        type: result.event,
                        date: d,
                    });
                }
            }
            if (result.event === "Repaid") {
                const repaidBytes: Uint8Array = ethers.utils.toUtf8Bytes(signatureRepaidEvent);
                ethers.utils.keccak256(repaidBytes);
                const {borrower, success, symbol} = result.args;
                if (borrower.toString().toLowerCase() === account){
                    transactions.push({
                        amount: amount,
                        investor: borrower,
                        token: symbol,
                        type: result.event,
                        date: d,
                        success: success
                    });
                }
            }
        }
    });
    return transactions.sort((a, b) => {
        if (b.date.getTime() > a.date.getTime()){
            return 1;
        }
        else if (b.date.getTime() === a.date.getTime()){
            return 0;
        }
        return -1;
    });
}

const getLoanAmount = async(tokenContract: Contract, signer: Signer) : Promise<Stake> => {
    const account_address: string = await signer.getAddress();
    const dapperbankContract = new ethers.Contract(DapperBank.networks[networkId].address, DapperBank.abi, signer);
    return await dapperbankContract.loans(account_address, tokenContract.address);
}

const makeLoan = async(tokenContract: Contract, amount: number, signer: Signer) => {
    const weiAmount = ethers.utils.parseEther(amount.toString());
    const dapperbankContract: Contract = new ethers.Contract(DapperBank.networks[networkId].address, DapperBank.abi, signer);
    await tokenContract.approve(dapperbankContract.address, weiAmount);
    return await dapperbankContract.takeLoan(weiAmount,tokenContract.address);
}

const repayDebt = async(tokenContract: Contract, loanAmount: number, signer: Signer) => {
    const dapperbankContract: Contract = new ethers.Contract(DapperBank.networks[networkId].address, DapperBank.abi, signer);
    const total = loanAmount + ((loanAmount / 100) * 5);
    const weiAmount = ethers.utils.parseEther(total.toString());
    await tokenContract.approve(dapperbankContract.address, weiAmount);
    return await dapperbankContract.repayLoan(tokenContract.address);
}

export {
    stake,
    unstake,
    giveRewards,
    getAmountOfTokensStaked,
    getTokenBalance,
    getHistory,
    makeLoan,
    repayDebt,
    getLoanAmount
}
