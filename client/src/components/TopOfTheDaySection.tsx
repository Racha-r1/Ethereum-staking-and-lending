import React from "react";
import Loader from "./Loader";
import Loser from "./Loser";
import Gainer from "./Gainer";
import Coin from "../api/Coin";
import {getTopGainers, getTopLosers } from "../util";


interface Props {
    coins: Coin[],
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const TopOfTheDaySection: React.FC<Props> = ({coins, loading, setLoading}) => {


    const [gainers, setGainers] = React.useState<Coin[]>([]);
    const [losers, setLosers] = React.useState<Coin[]>([]);

    React.useEffect(()=> {
        if (coins.length > 0) {
          setGainers(getTopGainers(coins));
          setLosers(getTopLosers(coins));
          setLoading(true); 
        }
        console.log('Entered in useEffect of TopOfTheDaySection');
    },[coins]);


    return (
        <div className="lg:w-11/12 mx-auto px-4 flex flex-wrap gap-5 relative bottom-10">
        <div className="round-md shadow-md bg-white p-8 md:w-5/12 w-full flex flex-col">
          {
            loading === false ? <Loader /> : 
            <>
              <h1 className="text-lg font-bold"> Top gainers of the day </h1>
              {
                gainers.map(coin => <Gainer key={"G" + coin.id} coin={coin}/>)
              }
            </>

          }
        </div>
        <div className="round-md shadow-md bg-white p-8 md:w-5/12 w-full flex flex-col">
          {
            loading === false ? <Loader /> : 
            <>
              <h1 className="text-lg font-bold"> Top Losers of the day </h1>
              {
                losers.map(coin => <Loser key={"L" + coin.id} coin={coin}/>)
              }
            </>

          }
         </div>
      </div>   
    )
}

export default TopOfTheDaySection;