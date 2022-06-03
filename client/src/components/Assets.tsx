import React from "react";
import Coin from "../api/Coin";
import { RootState } from "../redux/store";
import CoinComponent from "./CoinComponent";
import { useSelector } from "react-redux";

interface Props {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentCoin: React.Dispatch<React.SetStateAction<Coin | undefined>>;
    currencycode: string;
}

const Assets: React.FC<Props> = ({
    setShowModal,
    setCurrentCoin,
    currencycode,
}: Props) => {
    const { coins } = useSelector((state: RootState) => state.coins);
    return (
        <>
            <h1 className="text-xl font-bold p-3"> Assets </h1>
            <table className="table-auto">
                <thead>
                    <tr className="text-left text-sm opacity-70">
                        <th className="lg:p-3 md:p-1">Name</th>
                        <th className="lg:p-3 md:p-1">Price</th>
                        <th className="lg:p-3 md:p-1">Market Cap</th>
                        <th className="lg:p-3 md:p-1">Circulating Supply</th>
                    </tr>
                </thead>
                <tbody>
                    {coins.map((coin) => (
                        <CoinComponent
                            currencycode={currencycode}
                            key={coin.id}
                            coin={coin}
                            setShowModal={setShowModal}
                            setCurrentCoin={setCurrentCoin}
                        />
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default Assets;
