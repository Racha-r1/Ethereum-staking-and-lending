import React from "react";
import { FaBars } from "react-icons/fa";
import Currencies from "../components/Currencies";
import Account from "../components/Account";
import { ReactComponent as Metamask } from "../svg/metamask.svg";
import logo from "../images/logo_transparent.png";
import { Link } from "react-router-dom";
import { RootState, AppDispatch } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { connect } from "../redux/features/accountSlice";

const Nav: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [toggle, setToggle] = React.useState<boolean>(false);
    const { isConnected } = useSelector((state: RootState) => state.account);
    return (
        <div className="lg:w-11/12 mx-auto p-4">
            <div className="flex justify-between items-start lg:hidden">
                <button onClick={() => setToggle(!toggle)}>
                    <FaBars className="text-white text-2xl" />
                </button>
                <Link className="" to="/">
                    <img src={logo} className="w-8" alt="logo" />
                </Link>
            </div>
            <nav
                className={`transition duration-500 ease-in-out flex flex-col lg:flex-row py-5 gap-2 justify-between lg:flex ${
                    toggle ? "flex" : "hidden"
                }`}
                id="nav_content"
            >
                {isConnected ? (
                    <>
                        <Link className="hidden lg:inline" to="/">
                            <img src={logo} className="w-8" alt="logo" />
                        </Link>
                        <div className="flex flex-col-reverse lg:flex-row flex-wrap gap-2 lg:items-center">
                            <Currencies />
                            <Account />
                        </div>
                    </>
                ) : (
                    <>
                        <Link className="hidden lg:inline" to="/">
                            <img src={logo} className="w-8" alt="logo" />
                        </Link>
                        <div className="flex flex-col-reverse lg:flex-row flex-wrap gap-2 lg:items-center">
                            <Currencies />
                            <button
                                className="transition duration-500 ease-in-out text-green-400 hover:bg-green-400 hover:text-white text-lg border-2 border-green-400 py-1 px-4 rounded-sm font-medium flex items-center gap-2 w-max"
                                onClick={() => dispatch(connect())}
                            >
                                <Metamask className="w-6 h-auto" /> Metamask{" "}
                            </button>
                        </div>
                    </>
                )}
            </nav>
        </div>
    );
};

export default Nav;
