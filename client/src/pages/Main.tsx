import TopOfTheDaySection from "../components/TopOfTheDaySection";
import StakeModal from "../components/StakeModal";
import Assets from "../components/Assets";
import Loader from "../components/Loader";
import React from "react";
import Coin from "../api/Coin";
import { ToastContainer } from "react-toastify";
import Nav from "../components/Nav";

interface Props {
    coins: Coin[];
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentCoin: React.Dispatch<React.SetStateAction<Coin | undefined>>;
    currencycode: string;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    currentCoin: Coin | undefined;
    showModal: boolean;
    account: string | undefined;
    isConnected: boolean;
    setCurrencyCode: React.Dispatch<React.SetStateAction<string>>;
    setAccount: React.Dispatch<React.SetStateAction<string | undefined>>;
    toggle: boolean;
    setToggle: React.Dispatch<React.SetStateAction<boolean>>;
    setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

const Main: React.FC<Props> = ({
    coins,
    setShowModal,
    setCurrentCoin,
    currencycode,
    loading,
    setLoading,
    currentCoin,
    showModal,
    setCurrencyCode,
    account,
    setAccount,
    isConnected,
    toggle,
    setToggle,
    setIsConnected,
}: Props) => {
    const connectWallet = async () => {
        if (window.ethereum) {
            window.ethereum
                .request({ method: "eth_requestAccounts" })
                .then((accounts: string[]) => setAccount(accounts[0]))
                .then(() => setIsConnected(true));
        }
    };

    return (
        <div className="min-h-screen">
            <ToastContainer
                position="top-center"
                style={{ width: "max-content" }}
            />
            <div className="bg-black pb-20">
                <Nav
                    setAccount={setAccount}
                    toggle={toggle}
                    setToggle={setToggle}
                    setIsConnected={setIsConnected}
                    setCurrencyCode={setCurrencyCode}
                    isConnected={isConnected}
                    account={account}
                />
                <div className="lg:w-11/12 mx-auto p-4">
                    <h1 className="font-bold text-2xl text-white">
                        {" "}
                        Daily Overview
                    </h1>
                </div>
            </div>
            <TopOfTheDaySection />
            <StakeModal
                coin={currentCoin}
                showModal={showModal}
                setShowModal={setShowModal}
                account={account}
            />
            <div className="lg:w-11/12 mx-auto px-4">
                <div className="w-full py-6">
                    <div className="flex flex-col gap-2 rounded-md shadow-md bg-white p-6">
                        {loading ? (
                            <Loader />
                        ) : (
                            <Assets
                                setCurrentCoin={setCurrentCoin}
                                setShowModal={setShowModal}
                                currencycode={currencycode}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
