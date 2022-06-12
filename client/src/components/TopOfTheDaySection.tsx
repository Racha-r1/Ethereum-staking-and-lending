import React from "react";
import Loader from "./Loader";
import Loser from "./Loser";
import Gainer from "./Gainer";
import { getTopGainers, getTopLosers } from "../util";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { setGainers, setLosers } from "../redux/features/coinsSlice";

const TopOfTheDaySection: React.FC = () => {
    const { coins, loading, gainers, losers } = useSelector(
        (state: RootState) => state.coins
    );
    const dispatch = useDispatch<AppDispatch>();

    React.useEffect(() => {
        if (coins.length > 0) {
            dispatch(setGainers(getTopGainers(coins)));
            dispatch(setLosers(getTopLosers(coins)));
        }
    }, [coins]);

    return (
        <div className="lg:w-11/12 mx-auto px-4 flex flex-wrap gap-5 relative bottom-10">
            <div className="round-md shadow-md bg-white p-8 flex-grow flex flex-col relative">
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <h1 className="text-lg font-bold">
                            {" "}
                            Top gainers of the day{" "}
                        </h1>
                        {gainers.length > 0 ? (
                            gainers.map((coin) => (
                                <Gainer key={"G" + coin.id} coin={coin} />
                            ))
                        ) : (
                            <h1 className="text-xl absolute top-2/4 translate-y-2/4 text-center left-0 right-0"> No gainers today </h1>
                        )}
                    </>
                )}
            </div>
            <div className="round-md shadow-md bg-white p-8 flex-grow flex flex-col relative">
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <h1 className="text-lg font-bold">
                            {" "}
                            Top Losers of the day{" "}
                        </h1>
                        {losers.length > 0 ? (
                            losers.map((coin) => (
                                <Loser key={"L" + coin.id} coin={coin} />
                            ))
                        ) : (
                            <h1 className="text-xl absolute top-2/4 translate-y-2/4 text-center left-0 right-0">
                                No Losers today
                            </h1>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TopOfTheDaySection;
