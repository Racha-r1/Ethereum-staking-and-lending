import Coin from "./Coin";

async function getCoins(page: number){
    const URL = `http://localhost:8080/coins/${page}`;
    const response = await fetch(URL);
    console.log(response);
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
function getERC20Tokens(tokens: Coin[]): Coin[] {
    const ERC_20_tokens = ["DAI","USDC","USDT","UNI","ZRX","AAVE","YFI","COMP","LINK","SUSHI","BAT", "CAKE","FLOW"];
    return tokens.filter(token => ERC_20_tokens.includes(token.symbol));
}

export async function getTokens(page: number){
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



export async function connectWallet() : Promise<string[]>{
    let accounts: string[] = [];
    if (window.ethereum){
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
    return accounts;
}