import Coin from "./Coin";

async function getCoins(page: number){
    const URL = `https://coinmarketcapapifinalwork.herokuapp.com/coins/${page}`;
    const response = await fetch(URL);
    const data = await response.json();
    return data;
} 

export async function fetchCoins(){
    // check if cache is empty and cachetimer has not passed yet (cachetimer of 10 minutes)
    if(localStorage.getItem("coins") === null){
        const data = await getCoins(1);
        const filtered = getERC20Tokens(data);
        localStorage.setItem("coins", JSON.stringify({
            "coins": filtered,
            "cachetimer": new Date().getTime() + 600000
        }));
    }
    else if (JSON.parse(localStorage.getItem("coins") as string).cachetimer < new Date().getTime()){
        const data = await getCoins(1);
        const filtered = getERC20Tokens(data);
        localStorage.setItem("coins", JSON.stringify({"coins": filtered, "cachetimer": new Date().getTime() + 600000}));
    }
    return JSON.parse(localStorage.getItem("coins") as string).coins;
}

// we only are interested in the ERC-20 tokens
function getERC20Tokens(tokens: Coin[]){
    const ERC_20_tokens = ["ETH","DAI","USDC","USDT","UNI","ZRX","AAVE","YFI","COMP","LINK","SUSHI","BAT", "CAKE","FLOW"];
    return tokens.filter(token => ERC_20_tokens.includes(token.symbol));
}