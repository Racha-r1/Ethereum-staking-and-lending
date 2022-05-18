import React from "react";
import { FaArrowUp } from "react-icons/fa";
import Coin from "../api/Coin";

interface Props {
    coin: Coin
}

const Gainer: React.FC<Props> = ({ coin }) => {
  return (
    <div className="flex items-center py-4 justify-between">
      <div className="flex gap-2 items-center">
        <img src={coin.img} alt="foto" className="w-10 h-10 mr-2" />
        <p> {coin.symbol} </p>
      </div>
      <p className="text-green-400 flex gap-1 items-center">
        {" "} <FaArrowUp /> {coin["24h"] + "%"}{" "}
      </p>
    </div>
  );
};

export default Gainer;
