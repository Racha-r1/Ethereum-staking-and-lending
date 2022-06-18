import React,{useEffect, useState} from "react";
import Nav from "../components/Nav";
import logo from "../images/logo.png";
import DPK from "../contracts/DPK.json";
import { useSelector } from "react-redux";
import {Signer, Contract, ethers } from "ethers";
import {giveRewards} from "../api/contract-methods";
import Button from "@mui/material/Button";
import DAI from "../contracts/DAI.json";
import USDC from "../contracts/USDC.json";
import CAKE from "../contracts/CAKE.json";
import COMP from "../contracts/COMP.json";
import AAVE from "../contracts/AAVE.json";
import BAT from "../contracts/BAT.json";
import FLOW from "../contracts/FLOW.json";
import UNI from "../contracts/UNI.json";
import LINK from "../contracts/LINK.json";
import USDT from "../contracts/USDT.json";
const Rewards: React.FC = () => {

    const [balance, setBalance] = useState(0);
    const {isConnected, account} = useSelector((state: any) => state.account);
    const GANACHE_NETWORK_ID: string = "5777";
    const contractInstances = [
        USDC.networks[GANACHE_NETWORK_ID].address,
        DAI.networks[GANACHE_NETWORK_ID].address,
        CAKE.networks[GANACHE_NETWORK_ID].address,
        COMP.networks[GANACHE_NETWORK_ID].address,
        AAVE.networks[GANACHE_NETWORK_ID].address,
        BAT.networks[GANACHE_NETWORK_ID].address,
        FLOW.networks[GANACHE_NETWORK_ID].address,
        UNI.networks[GANACHE_NETWORK_ID].address,
        LINK.networks[GANACHE_NETWORK_ID].address,
        USDT.networks[GANACHE_NETWORK_ID].address,
    ];
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contractAbi = DPK.abi;
    const contractAddress = DPK.networks[GANACHE_NETWORK_ID].address;
    const signer: Signer = provider.getSigner();
    const contract: Contract = new ethers.Contract(contractAddress,contractAbi,signer);

    useEffect(() => {
        if(isConnected){
            contract.balanceOf(account).then((balance: number) => {
                balance = parseFloat(
                    ethers.utils.formatEther(balance.toString())
                );
                setBalance(balance);
            });
        }
    },[]);

    const claim = async() => {
        if(window.ethereum){
            if(isConnected){
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer: Signer = provider.getSigner();
                const tx = await giveRewards(contractInstances, signer);
                await tx.wait();
                contract.balanceOf(account).then((balance: number) => {
                    balance = parseFloat(
                        ethers.utils.formatEther(balance.toString())
                    );
                    setBalance(balance);
                });

            }
        }
    };

    return (
        <div className="min-h-screen">
            <div className="bg-black pb-20">
                <Nav />
                <div className="lg:w-11/12 mx-auto p-4">
                    <h1 className="font-bold text-2xl text-white"> Rewards</h1>
                </div>
            </div>
            <div className="lg:w-11/12 mx-auto px-4 flex flex-wrap gap-5 relative bottom-10">
                <div className="rounded-md shadow-md bg-white p-6 w-full">
                    {
                       balance <= 0 ? 
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4 mb-10">
                                <img
                                    src={logo}
                                    alt="logo"
                                    className="w-12 h-12 rounded-full"
                                />
                                <div className="flex flex-col">
                                    <h1>
                                        {" "}
                                        You currently have 0 DPK tokens, be sure to
                                        stake in order to get the DPK token as a staking
                                        reward. <br />
                                        Click the claim rewards button to claim your rewards (after every 2 minutes).
                                    </h1>
                                    <h1 className="text-red-600 mt-2"> Note: You can only claim a reward after every 2 minutes, claiming rewards more than once every 2 minutes will result in a waste of funds because of the gas fees</h1>
                                </div>
                            </div>
                            <Button variant="outlined" className="w-max" onClick={async() => await claim()}>
                                Claim Rewards
                            </Button>
                        </div> 
                        : <div className="flex flex-col gap-4">
                                <div className="flex gap-4 mb-10">
                                    <img
                                        src={logo}
                                        alt="logo"
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div className="flex flex-col">
                                        <h1>
                                            You currently have {balance} DPK tokens.<br />
                                            Click the claim rewards button to claim your rewards (after every 2 minutes).
                                        </h1>
                                        <h1 className="text-red-600 mt-2"> Note: You can only claim a reward after every 2 minutes, claiming rewards more than once every 2 minutes will result in a waste of funds because of the gas fees</h1>
                                    </div>
                                </div>
                                <Button variant="outlined" className="w-max" onClick={async() => await claim()}>
                                    Claim Rewards
                                </Button>
                           </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default Rewards;
