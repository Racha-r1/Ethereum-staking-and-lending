import React from "react";

interface Props {
    setCurrencyCode: React.Dispatch<React.SetStateAction<string>>;
}

const Currencies: React.FC<Props> = ({setCurrencyCode}: Props) => {

    const [toggle, setToggle] = React.useState(false);
    const [currency, setCurrency] = React.useState("$");
    const handleToggle = () => setToggle(!toggle);
    const setDollar = () => {
        setCurrency("$");
        setToggle(!toggle);
        setCurrencyCode(currencyMapping["$"]);
    }
    const setEuro = () => {
        setCurrency("€");
        setToggle(!toggle);
        setCurrencyCode(currencyMapping["€"]);
    }
    const setPound = () => {
        setCurrency("£");
        setToggle(!toggle);
        setCurrencyCode(currencyMapping["£"]);
    }

    const currencyMapping = {
        "$": "usd",
        "€": "eur",
        "£": "gbp"
    }

    return (
        <div className="flex flex-col relative">
            <button onClick={handleToggle} className="text-green-400 bg-transparent border-2 border-green-400 font-medium text-sm px-4 py-2 text-center flex items-center flex-grow font-bold" type="button">{currency} <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
            <div className={`z-10 font-bold bg-transparent border-2 border-green-400 w-full absolute top-full ${toggle ? "block" : "hidden"}`}>
                <ul className="text-green-400">
                    <li onClick={setDollar} className="block px-4 py-2 hover:bg-gray-900"> $ </li>
                    <li onClick={setEuro} className="block px-4 py-2 hover:bg-gray-900"> € </li>
                    <li onClick={setPound} className="block px-4 py-2 hover:bg-gray-900"> £ </li>
                </ul>
            </div>
        </div>
    );
}

export default Currencies;
