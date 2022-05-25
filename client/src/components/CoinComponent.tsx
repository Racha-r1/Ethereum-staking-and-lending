import React from 'react'
import Coin from '../api/Coin'
import Price from '../api/Price'

interface Props {
    coin: Coin
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    setCurrentCoin: React.Dispatch<React.SetStateAction<Coin | undefined>>
    currencycode: string
}

const CoinComponent: React.FC<Props> = ({
    coin,
    setShowModal,
    setCurrentCoin,
    currencycode,
}: Props) => {
    React.useEffect(() => {}, [coin])
    return (
        <tr
            className="text-left text-medium opacity-100 hover:bg-blue-100"
            onClick={() => {
                setShowModal(true)
                setCurrentCoin(coin)
            }}
        >
            <td className="lg:p-3 md:p-1">
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
            <td className="lg:p-3 md:p-1">
                {coin.price[currencycode as keyof Price]}
            </td>
            <td className="lg:p-3 md:p-1">
                {coin.marketcap[currencycode as keyof Price]}
            </td>
            <td className="lg:p-3 md:p-1">{coin.supply}</td>
        </tr>
    )
}

export default CoinComponent
