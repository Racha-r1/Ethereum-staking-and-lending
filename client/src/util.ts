import Coin from "./api/Coin";

export const getTopGainers = (coins: Coin[]) : Coin[] => {
    const gainers =  coins.filter(coin => coin["24h"][0] === "+").map(coin => {
      coin["24h"] = parseFloat(coin["24h"].slice(1).replace("%", "")).toFixed(2);
      return coin;
    }).sort((a, b) => parseInt(b["24h"]) - parseInt(a["24h"])).slice(0,5);
    return gainers;
}

export const getTopLosers = (coins: Coin[]) : Coin[] => {
    const losers =  coins.filter(coin => coin["24h"][0] === "-").map(coin => {
      coin["24h"] = parseFloat(coin["24h"].slice(1).replace("%", "")).toFixed(2);
      return coin;
    }).sort((a, b) => parseInt(b["24h"]) - parseInt(a["24h"])).slice(0,5);
    return losers;
}