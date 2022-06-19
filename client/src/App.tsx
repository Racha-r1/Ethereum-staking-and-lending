import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import Main from "./pages/Main";
import History from "./pages/History";
import Rewards from "./pages/Rewards";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { fetchCoins } from "./redux/features/coinsSlice";
import {setAccount, setIsConnected, getTransactionHistory, setTransactions} from "./redux/features/accountSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/store";

const App: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    if (window.ethereum){
        window.ethereum.on('accountsChanged', (accounts) => {
            if(accounts.length > 0){
                dispatch(setAccount(accounts[0]));
                dispatch(getTransactionHistory(accounts[0]));
            }
            else {
                dispatch(setAccount(undefined));
                dispatch(setIsConnected(false));
                dispatch(setTransactions([]));
            }
        });
    }

    useEffect(() => {
        dispatch(fetchCoins(1));
    }, []);

   

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main />}>
                    {" "}
                </Route>
                <Route path="/history" element={<History />}>
                    {" "}
                </Route>
                <Route path="/rewards" element={<Rewards />}>
                    {" "}
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
