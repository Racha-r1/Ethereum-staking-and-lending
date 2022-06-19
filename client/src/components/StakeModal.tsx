import React from "react";
import {
    stake,
    getAmountOfTokensStaked,
    unstake,
    makeLoan,
    getTokenBalance,
    getLoanAmount,
    repayDebt
} from "../api/contract-methods";
import DAI from "../contracts/DAI.json";
import USDC from "../contracts/USDC.json";
import CAKE from "../contracts/CAKE.json";
import COMP from "../contracts/COMP.json";
import AAVE from "../contracts/AAVE.json";
import BAT from "../contracts/BAT.json";
import FLOW from "../contracts/FLOW.json";
import UNI from "../contracts/UNI.json";
import LINK from "../contracts/LINK.json";
import { toast } from "react-toastify";
import { Contract, ethers, Signer } from "ethers";
import USDT from "../contracts/USDT.json";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { setShowModal } from "../redux/features/coinsSlice";


const StakeModal: React.FC = () => {
    const { currentCoin, showModal } = useSelector(
        (state: RootState) => state.coins
    );
    const { account } = useSelector((state: RootState) => state.account);
    const dispatch = useDispatch<AppDispatch>();
    const [amount, setAmount] = React.useState<number>(0);
    const GANACHE_NETWORK_ID: string = "5777";
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const [balance, setBalance] = React.useState<number>(0);
    const [contract, setContract] = React.useState<undefined | Contract>(
        undefined
    );
    const [stakedBalance, setStakedBalance] = React.useState<number>(0);
    const [loanAmount, setLoanAmount] = React.useState<number>(0);

    const [value, setValue] = React.useState<string>("1");

    const handleChange = (event, newValue: string) => {
        setValue(newValue);
    };

    const changeNum = (e) => {
        if (!isNaN(e.target.value)) {
            setAmount(parseInt(e.target.value));
        }
    };

    const mapping = {
        DAI: DAI,
        USDC: USDC,
        CAKE: CAKE,
        COMP: COMP,
        AAVE: AAVE,
        BAT: BAT,
        FLOW: FLOW,
        UNI: UNI,
        LINK: LINK,
        USDT: USDT,
    };

    const handleBorrow = async () => {
        if(loanAmount === 0) {
            const signer = provider.getSigner();
            if (contract instanceof Contract) {
                const liquid = await getTokenBalance(contract.address, signer);
                if (parseInt(ethers.utils.formatEther(liquid)) <= amount) {
                    toast.error("Sorry we can't process your request right now due to insufficient liquidity of this coin!",{
                        theme: "dark",
                    });
                    return;
                }
                const tx = await makeLoan(contract, amount, signer);
                await tx.wait();
                toast.success("Loan request sent successfully!",{
                    theme: "dark",
                });
                dispatch(setShowModal(false));
            }
            return;
        }
        toast.error("You currently already have a loan, please repay that first!",{
            theme: "dark",
        });
    }

    const repay = async() => {
        const signer = provider.getSigner();
        if (contract instanceof Contract){
            if (loanAmount > 0) {
                const tx = await repayDebt(contract, loanAmount, signer);
                const receipt = await tx.wait();
                const args = receipt.events.find(({ event }) => event === 'Repaid').args
                const {success} = args;
                if (success) {
                    toast.success("Debt repaid successfully!",{
                        theme: "dark",
                    });
                }
                else {
                    toast.error("You were not on time in repaying your debt so we've taken your colleteral",{
                        theme: "dark",
                    });
                }
                dispatch(setShowModal(false));
            }
        }
    }

    const stakedNotification = (coinName: string) =>
        toast.success(`Succesfully staked ${coinName} to the platform!`, {
            theme: "dark",
        });

    const unstakedNotification = (coinName: string) =>
        toast.success(`Succesfully unstaked ${coinName}!`, {
            theme: "dark",
        });

    const errorNotification = (error: Error) =>
        toast.error(`${error.message}`, {
            theme: "dark",
        });

    const handleStake = async () => {
        if (amount === 0) {
            alert("Please enter an amount to stake");
            return;
        } else {
            try {
                if (contract instanceof Contract) {
                    await stake(contract, String(amount), contract.signer);
                    const symbol: string = await contract.symbol();
                    stakedNotification(symbol);
                    dispatch(setShowModal(false));
                }
            } catch (error) {
                if (error instanceof Error) {
                    errorNotification(error);
                }
            }
        }
    };

    const handleUnstake = async () => {
        try {
            if (contract instanceof Contract) {
                if (amount > 0){
                    await unstake(contract, contract.signer, amount);
                    const symbol: string = await contract.symbol();
                    unstakedNotification(symbol);
                    dispatch(setShowModal(false));
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    };

    React.useEffect(() => {
        if (currentCoin) {
            if (mapping[currentCoin.symbol] !== undefined) {
                const contractAbi = mapping[currentCoin.symbol].abi;
                const contractAddress =
                    mapping[currentCoin.symbol].networks[GANACHE_NETWORK_ID]
                        .address;
                const signer: Signer = provider.getSigner();
                const contract: Contract = new ethers.Contract(
                    contractAddress,
                    contractAbi,
                    signer
                );
                setContract(contract);
                if (account) {
                    getAmountOfTokensStaked(contract, signer).then((staked) => {
                        const stakedBalance = parseInt(
                            ethers.utils.formatEther(staked.amount.toString())
                        );
                        setStakedBalance(stakedBalance);
                    });
                    
                    getLoanAmount(contract, signer).then((loan) => {
                        const loanAmount = parseInt(
                            ethers.utils.formatEther(loan.amount.toString())
                        );
                        setLoanAmount(loanAmount);
                    });
                    contract.balanceOf(account).then((balance: number) => {
                        balance = parseInt(
                            ethers.utils.formatEther(balance.toString())
                        );
                        setBalance(balance);
                    });
                }
            }
        }
    }, [currentCoin]);

    React.useEffect(() => {
        if (currentCoin) {
            if (mapping[currentCoin.symbol] !== undefined) {
                const contractAbi = mapping[currentCoin.symbol].abi;
                const contractAddress =
                    mapping[currentCoin.symbol].networks[GANACHE_NETWORK_ID]
                        .address;
                const signer: Signer = provider.getSigner();
                const contract: Contract = new ethers.Contract(
                    contractAddress,
                    contractAbi,
                    signer
                );
                setContract(contract);
                if (account) {
                    getAmountOfTokensStaked(contract, signer).then((staked) => {
                        const stakedBalance = parseInt(
                            ethers.utils.formatEther(staked.amount.toString())
                        );
                        setStakedBalance(stakedBalance);
                    });

                    getLoanAmount(contract, signer).then((loan) => {
                        const loanAmount = parseInt(
                            ethers.utils.formatEther(loan.amount.toString())
                        );
                        setLoanAmount(loanAmount);
                    });

                    contract.balanceOf(account).then((balance: number) => {
                        balance = parseInt(
                            ethers.utils.formatEther(balance.toString())
                        );
                        setBalance(balance);
                    });
                }
            }
        }
    }, []);

    return (
        <div
            id="modal"
            className={`${
                showModal ? "flex" : "hidden"
            } bg-gray-700 bg-opacity-50 toverflow-y-auto overflow-x-hidden fixed right-0 left-0 top-0 z-50 justify-center items-center inset-0 h-modal"`}
        >
            <div className="relative px-4 w-auto">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex justify-between items-center p-5 rounded-t">
                        <Box sx={{ width: "100%", typography: "body1" }}>
                            <TabContext value={value}>
                                <Box
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: "divider",
                                        p: 0,
                                    }}
                                >
                                    <TabList
                                        onChange={handleChange}
                                        aria-label="Tabs defi app"
                                    >
                                        <Tab label="Stake" value="1" />
                                        <Tab label="Lend" value="2" />
                                        <button
                                            onClick={() => {
                                                dispatch(setShowModal(false));
                                                setAmount(0);
                                                setStakedBalance(0);
                                                setBalance(0);
                                            }}
                                            type="button"
                                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                            data-modal-toggle="medium-modal"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </button>
                                    </TabList>
                                </Box>
                                <TabPanel value="1" sx={{ p: 0 }}>
                                    <div className="flex flex-col gap-4 pl-2 pt-2">
                                        <div className="space-y-2">
                                            <div className="flex justify-between flex-wrap">
                                                <p className="opacity-60 text-sm">
                                                    {" "}
                                                    {balance > 0
                                                        ? "Balance: " + balance
                                                        : ""}
                                                </p>
                                                <p className="opacity-60 text-sm">
                                                    {" "}
                                                    {stakedBalance > 0
                                                        ? "Amount staked: " +
                                                          (stakedBalance + loanAmount)
                                                        : ""}
                                                        <br/> 
                                                        {loanAmount > 0
                                                            ? "Locked amount: " + loanAmount
                                                        : ""}
                                                </p>
                                            </div>
                                            {currentCoin && (
                                                <div className="flex items-center gap-4 pb-4">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={
                                                                currentCoin.img
                                                            }
                                                            alt="foto"
                                                            className="lg:w-10 lg:h-10 w-5 h-5 mr-2"
                                                        />
                                                        <p>
                                                            {" "}
                                                            {
                                                                currentCoin.symbol
                                                            }{" "}
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter amount"
                                                        className="p-2 bg-white rounded-md shadow-md"
                                                        value={
                                                            amount > 0
                                                                ? amount
                                                                : ""
                                                        }
                                                        onChange={changeNum}
                                                        min={0}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center rounded-b border-gray-200 dark:border-gray-600">
                                            <Button
                                                variant="outlined"
                                                onClick={async () =>
                                                    await handleStake()
                                                }
                                            >
                                                Stake tokens
                                            </Button>
                                            {stakedBalance > 0 && (
                                                <Button
                                                    variant="outlined"
                                                    onClick={async () =>
                                                        await handleUnstake()
                                                    }
                                                >
                                                    Unstake tokens
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </TabPanel>
                                
                                <TabPanel value="2" sx={{ p: 0 }}>
                                    <div className="flex flex-col gap-4 pl-2 pt-2">
                                            <div className="flex justify-between flex-wrap">
                                                <p className="opacity-60 text-sm">
                                                    {" "}
                                                    {loanAmount > 0
                                                        ? "Amount of tokens lend: " +
                                                        loanAmount
                                                        : ""}
                                                </p>
                                            </div>
                                        <div className="flex pt-2">
                                            {currentCoin && (
                                                <div className="flex items-center gap-4 pb-4">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={
                                                                currentCoin.img
                                                            }
                                                            alt="foto"
                                                            className="lg:w-10 lg:h-10 w-5 h-5 mr-2"
                                                        />
                                                        <p>
                                                            {" "}
                                                            {
                                                                currentCoin.symbol
                                                            }{" "}
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter amount"
                                                        className="p-2 bg-white rounded-md shadow-md"
                                                        value={
                                                            amount > 0
                                                                ? amount
                                                                : ""
                                                        }
                                                        onChange={changeNum}
                                                        min={0}
                                                    />
                                                </div>
                                            )}
                                            </div>
                                        <div className="flex flex-col rounded-b border-gray-200 dark:border-gray-600 gap-2">
                                            <p className="font-bold"> Borrow rate: 5% </p>
                                            <p className="font-bold text-red-400"> Note: You will have to provide an equal amount as the lend amount as colletoral</p>
                                            <div className="flex justify-between rounded-b border-gray-200 dark:border-gray-600">
                                                <Button className="w-32"
                                                    variant="outlined"
                                                    onClick={async () =>
                                                        await handleBorrow()
                                                    }
                                                >
                                                    Lend
                                                </Button>
                                                {loanAmount > 0 && (
                                                    <Button
                                                        variant="outlined"
                                                        onClick={async() => await repay()}
                                                    >
                                                        Repay Loan
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </TabPanel>
                            </TabContext>
                        </Box>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StakeModal;
