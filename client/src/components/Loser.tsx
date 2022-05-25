import React from "react";
import Coin from "../api/Coin";
import {FaArrowDown} from "react-icons/fa";

interface Props {
    coin: Coin
}

const Loser: React.FC<Props> = ({coin}: Props) => {
    return(
        <div className="flex items-center py-4 justify-between">
            <div className="flex gap-2 items-center">
                <img src={coin.img} alt="foto" className="w-10 h-10 mr-2"/>
                <p> {coin.symbol} </p>
            </div>
            <p className="text-red-400 flex gap-1 items-center"> <FaArrowDown /> {coin["24h"] + "%"} </p>
        </div>
    )
}

export default Loser;