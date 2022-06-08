import React from "react";
import Coin from "../api/Coin";
import Price from "../api/Price";
import { RootState, AppDispatch } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentCoin, setShowModal } from "../redux/features/coinsSlice";

interface Props {
    coin: Coin;
}

const CoinComponent: React.FC<Props> = ({ coin }: Props) => {
    const dispatch = useDispatch<AppDispatch>();
    const { currencyCode } = useSelector((state: RootState) => state.coins);
    return (
        <tr
            className="text-left text-medium opacity-100 hover:bg-blue-100"
            onClick={() => {
                dispatch(setShowModal(true));
                dispatch(setCurrentCoin(coin));
            }}
        >
            <td className="lg:p-3 p-2">
                <div className="flex items-center">
                    <img
                        src={coin.img}
                        alt="foto"
                        className="lg:w-10 lg:h-10 w-5 h-5 mr-2"
                    />
                    <p className="mr-2"> {coin.name} </p>
                    <p> {coin.symbol} </p>
                </div>
            </td>
            <td className="lg:p-3 p-2">
                {coin.price[currencyCode as keyof Price]}
            </td>
            <td className="lg:p-3 p-2 hidden sm:table-cell">
                {coin.marketcap[currencyCode as keyof Price]}
            </td>
            <td className="lg:p-3 p-2 hidden sm:table-cell">{coin.supply}</td>
        </tr>
    );
};

export default CoinComponent;
