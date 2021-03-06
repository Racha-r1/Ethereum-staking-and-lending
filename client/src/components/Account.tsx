import React from "react";
import { Link } from "react-router-dom";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const Account: React.FC = () => {
    const { account } = useSelector((state: RootState) => state.account);
    const [toggle, setToggle] = React.useState(false);
    const handleToggle = () => setToggle(!toggle);
    return (
        <div className="flex flex-col relative w-max">
            <button
                onClick={handleToggle}
                className="text-green-400 bg-transparent border-2 border-green-400 font-medium text-sm px-4 py-2 text-center flex items-center flex-grow font-bold"
                type="button"
            >
                {account?.slice(0, 4) + "..." + account?.slice(-4)}{" "}
                <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    ></path>
                </svg>
            </button>
            <div
                className={`z-20 font-bold bg-black border-2 border-green-400 w-full absolute top-full ${
                    toggle ? "block" : "hidden"
                }`}
            >
                <ul className="text-green-400">
                    <li>
                        <Link
                            to="/rewards"
                            className="block px-4 py-2 hover:bg-gray-900 text-sm font-normal"
                        >
                            Rewards
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/history"
                            className="block px-4 py-2 hover:bg-gray-900 text-sm font-normal"
                        >
                            History
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Account;
