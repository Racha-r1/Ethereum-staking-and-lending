import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import Main from "./pages/Main";
import History from "./pages/History";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { fetchCoins } from "./redux/features/coinsSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/store";

const App: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

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
            </Routes>
        </Router>
    );
};

export default App;
