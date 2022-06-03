import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import Coin from "./api/Coin";
import Main from "./pages/Main";
import History from "./pages/History";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { fetchCoins } from "./redux/reducers/CoinsReducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./redux/store";

const App: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { coins } = useSelector((state: RootState) => state.coins);
    const [toggle, setToggle] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentCoin, setCurrentCoin] = useState<Coin | undefined>(undefined);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [account, setAccount] = useState<string | undefined>(undefined);
    const [currencycode, setCurrencyCode] = useState<string>("usd");
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        console.log("In useEffect");
        dispatch(fetchCoins(1));
    }, []);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Main
                            coins={coins}
                            currencycode={currencycode}
                            setCurrentCoin={setCurrentCoin}
                            setShowModal={setShowModal}
                            loading={loading}
                            setLoading={setLoading}
                            account={account}
                            currentCoin={currentCoin}
                            showModal={showModal}
                            setCurrencyCode={setCurrencyCode}
                            setAccount={setAccount}
                            isConnected={isConnected}
                            toggle={toggle}
                            setToggle={setToggle}
                            setIsConnected={setIsConnected}
                        />
                    }
                >
                    {" "}
                </Route>
                <Route
                    path="/history"
                    element={
                        <History
                            setCurrencyCode={setCurrencyCode}
                            account={account}
                            setAccount={setAccount}
                            isConnected={isConnected}
                            toggle={toggle}
                            setToggle={setToggle}
                            setIsConnected={setIsConnected}
                        />
                    }
                >
                    {" "}
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
