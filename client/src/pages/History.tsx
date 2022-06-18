import React from "react";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { getTransactionHistory } from "../redux/features/accountSlice";
import { RootState, AppDispatch } from "../redux/store";
import Transaction from "../components/Transaction";
import { v4 as uuidv4 } from 'uuid';
import Nav from "../components/Nav";

const History: React.FC = () => {
    const { transactions, account } = useSelector((state: RootState) => state.account);
    const dispatch = useDispatch<AppDispatch>();

    React.useEffect(() => {
        if (account) {
            dispatch(getTransactionHistory(account));
        }
    }, []);

    return (
        <div className="min-h-screen">
            <ToastContainer
                position="top-center"
                style={{ width: "max-content" }}
            />
            <div className="bg-black pb-20">
                <Nav />
                <div className="lg:w-11/12 mx-auto p-4">
                    <h1 className="font-bold text-2xl text-white">
                        {" "}
                        Transaction History
                    </h1>
                </div>
            </div>

            <div className="lg:w-11/12 mx-auto px-4 flex flex-wrap gap-5 relative bottom-10">
                <div className="round-md shadow-md bg-white p-8 w-full flex flex-col">
                    {transactions.length > 0 ? (
                        <table>
                            <thead>
                                <tr className="text-left text-sm opacity-70">
                                    <th className="lg:p-3 p-2">Investor</th>
                                    <th className="lg:p-3 p-2 hidden sm:table-cell">
                                        Token
                                    </th>
                                    <th className="lg:p-3 p-2">Amount</th>
                                    <th className="lg:p-3 p-2 hidden md:table-cell">
                                        Timestamp
                                    </th>
                                    <th className="lg:p-3 p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <Transaction key={uuidv4()} event={transaction} />
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <h1 className="text-center text-lg">
                            You haven't made any transactions{" "}
                        </h1>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;
