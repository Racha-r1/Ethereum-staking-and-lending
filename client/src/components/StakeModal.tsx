import React from "react";
import Coin from "../api/Coin";
import {stake, getAmountOfTokensStaked, unstake} from "../api/contract-methods";
import DAI from "../contracts/DAI.json";
import USDC from "../contracts/USDC.json";
import CAKE from "../contracts/CAKE.json";
import COMP from "../contracts/COMP.json";
import AAVE from "../contracts/AAVE.json";
import BAT from "../contracts/BAT.json";
import FLOW from "../contracts/FLOW.json";
import UNI from "../contracts/UNI.json";
import LINK from "../contracts/LINK.json";
import { toast } from 'react-toastify';
import { Contract, ethers, Signer } from "ethers";

interface Props {
    coin: Coin | undefined;
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    account: string | undefined;
}

const StakeModal: React.FC<Props> = ({coin, showModal, setShowModal, account}) => {

    const [amount, setAmount] = React.useState<number>(0);
    const GANACHE_NETWORK_ID: string = '5777';
    const provider = new ethers.providers.Web3Provider(window.ethereum);


    const [balance, setBalance] = React.useState<number>(0);
    const [contract , setContract] = React.useState<undefined | Contract>(undefined);
    const [stakedBalance, setStakedBalance] = React.useState<number>(0);

    const changeNum = (e) => {
        if (!isNaN(e.target.value)) {
            setAmount(parseInt(e.target.value));
        }
    }

    const mapping = {
        "DAI": DAI,
        "USDC": USDC,
        "CAKE": CAKE,
        "COMP": COMP,
        "AAVE": AAVE,
        "BAT": BAT,
        "FLOW": FLOW,
        "UNI": UNI,
        "LINK": LINK
    }
    
    const stakedNotification = (coinName: string) => toast.success(`Succesfully staked ${coinName} to the platform!`, {
        theme: "dark"
    });
    
    const errorNotification = (error: Error) => toast.error(`${error.message}`, {
        theme: "dark"
    });

    const handleStake = async() => {
        if (amount === 0) {
            alert("Please enter an amount to stake");
            return;
        }
        else {
            try {
                if (contract instanceof Contract){
                    await stake(contract, String(amount), contract.signer);
                    setShowModal(false);
                    const symbol: string = await contract.symbol();
                    stakedNotification(symbol);
                }
            }
            catch(error){
                if (error instanceof Error) {
                    errorNotification(error);
                }
            }
        }

    }


    const handleUnstake = async() => {
        try {  
            if (contract instanceof Contract){
                await unstake(contract, contract.signer);
                setShowModal(false);
            }

        }
        catch(error){
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    }

    React.useEffect(() => {
        if(coin){
            if (mapping[coin.symbol] !== undefined) {
                const contractAbi = mapping[coin.symbol].abi;
                const contractAddress = mapping[coin.symbol].networks[GANACHE_NETWORK_ID].address;
                const signer: Signer = provider.getSigner();
                const contract: Contract = new ethers.Contract(contractAddress, contractAbi, signer);
                setContract(contract);
                if (account){
                    getAmountOfTokensStaked(contract, signer).then(staked => {
                        const stakedBalance = parseInt(ethers.utils.formatEther(staked.amount.toString()));
                        setStakedBalance(stakedBalance);
                    });

                    contract.balanceOf(account).then((balance: number) => {
                        balance = parseInt(ethers.utils.formatEther(balance.toString()));
                        setBalance(balance);
                    });
                }
            }
        }
    },[account,coin]);

    return (
            <div id="modal" className={`${showModal ? "flex" : "hidden"} bg-gray-700 bg-opacity-50 toverflow-y-auto overflow-x-hidden fixed right-0 left-0 top-0 z-50 justify-center items-center inset-0 h-modal"`}>
                <div className="relative px-4 w-auto">
                    <div className="relative bg-white rounded-lg shadow">
                        <div className="flex justify-between items-center p-5 rounded-t border-b">
                            <h3 className="text-xl font-medium text-gray-900">
                                Supply
                            </h3>
                            <button onClick={() => {setShowModal(false); setAmount(0);}} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="medium-modal">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>  
                            </button>
                        </div>
                        <div className="p-6 space-y-2">
                            <div className="flex justify-between flex-wrap">
                                <p className="opacity-60 text-sm"> {balance > 0 ? "Balance: " + balance : ""}</p>
                                <p className="opacity-60 text-sm"> {stakedBalance > 0 ? "Amount staked: " + stakedBalance : ""}</p>
                            </div>
                            {
                                coin && <div className="flex items-center gap-4">
                                            <div className="flex items-center">
                                                <img src={coin.img} alt="foto" className="lg:w-10 lg:h-10 w-5 h-5 mr-2"/>
                                                <p> {coin.symbol} </p>
                                            </div>
                                            <input type="text" placeholder="Enter amount" className="p-2 bg-white rounded-md shadow-md" value={amount > 0 ? amount : undefined} onChange={changeNum} min={0}/> 
                                        </div>
                            }
                           
                        </div>
                        <div className="flex items-center px-6 py-3 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                            <button data-modal-toggle="medium-modal" type="button" className="text-white bg-green-500 py-2 px-3 rounded-md border-2 border-green-500 border-font-bold hover:bg-white hover:text-green-400" onClick={async() => await handleStake()}>Stake tokens</button>
                            {
                                stakedBalance > 0 &&   <button data-modal-toggle="medium-modal" type="button" className="text-white bg-green-500 py-2 px-3 rounded-md border-2 border-green-500 border-font-bold hover:bg-white hover:text-green-400" onClick={async() => await handleUnstake()}>Unstake tokens</button>
                            }            
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default StakeModal;

