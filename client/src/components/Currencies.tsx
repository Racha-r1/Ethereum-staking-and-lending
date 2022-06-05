import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { setCurrencyCode } from "../redux/features/coinsSlice";

const Currencies: React.FC = () => {
    const { currencyCode } = useSelector((state: RootState) => state.coins);
    const [toggle, setToggle] = React.useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const currencyMapping = {
        $: "usd",
        "€": "eur",
        "£": "gbp",
    };

    const currencyMappingReverse = {
        usd: "$",
        eur: "€",
        gbp: "£",
    };

    const [currency, setCurrency] = React.useState(
        currencyMappingReverse[currencyCode]
    );
    const handleToggle = () => setToggle(!toggle);
    const setDollar = () => {
        setCurrency("$");
        setToggle(!toggle);
        dispatch(setCurrencyCode(currencyMapping["$"]));
    };
    const setEuro = () => {
        setCurrency("€");
        setToggle(!toggle);
        dispatch(setCurrencyCode(currencyMapping["€"]));
    };
    const setPound = () => {
        setCurrency("£");
        setToggle(!toggle);
        dispatch(setCurrencyCode(currencyMapping["£"]));
    };

    return (
        <div className="flex flex-col relative z-10 w-max">
            <button
                onClick={handleToggle}
                className="text-green-400 bg-transparent border-2 border-green-400 font-medium text-sm px-4 py-2 text-center flex items-center flex-grow font-bold"
                type="button"
            >
                {currency}{" "}
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
                className={`z-10 font-bold bg-transparent border-2 border-green-400 w-full absolute top-full bg-black ${
                    toggle ? "block" : "hidden"
                }`}
            >
                <ul className="text-green-400 bg-black">
                    <li
                        onClick={setDollar}
                        className="block px-4 py-2 hover:bg-gray-900"
                    >
                        {" "}
                        ${" "}
                    </li>
                    <li
                        onClick={setEuro}
                        className="block px-4 py-2 hover:bg-gray-900"
                    >
                        {" "}
                        €{" "}
                    </li>
                    <li
                        onClick={setPound}
                        className="block px-4 py-2 hover:bg-gray-900"
                    >
                        {" "}
                        £{" "}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Currencies;
