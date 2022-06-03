import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { getTransactionHistory } from '../api/contract-methods'
import { ethers, Signer } from 'ethers'
import Event from '../api/Event'
import Transaction from '../components/Transaction'
import Nav from '../components/Nav'

interface Props {
    account: string | undefined
    isConnected: boolean
    setCurrencyCode: React.Dispatch<React.SetStateAction<string>>
    setAccount: React.Dispatch<React.SetStateAction<string | undefined>>
    toggle: boolean
    setToggle: React.Dispatch<React.SetStateAction<boolean>>
    setIsConnected: React.Dispatch<React.SetStateAction<boolean>>
}

const History: React.FC<Props> = ({
    setCurrencyCode,
    account,
    setAccount,
    isConnected,
    toggle,
    setToggle,
    setIsConnected,
}) => {
    const [transactions, setTransactions] = useState<Event[]>([])
    const connectWallet = () => {
        if (window.ethereum) {
            window.ethereum
                .request({ method: 'eth_requestAccounts' })
                .then((accounts: string[]) => setAccount(accounts[0]))
                .then(() => setIsConnected(true))
        }
    }

    React.useEffect(() => {
        async function getHistory() {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer: Signer = provider.getSigner()
            const results = await getTransactionHistory(signer)
            const signatureStakedEvent = 'Staked(address,string,uint,uint256)'
            const signatureUnstakedEvent =
                'Unstaked(address,string,uint,uint256)'
            const t: Event[] = new Array()
            results.forEach(async result => {
                if (result.args) {
                    const amount = parseInt(
                        ethers.utils.formatEther(
                            result.args['amount'].toString()
                        )
                    )
                    const d = new Date(
                        parseInt(result.args['timestamp']) * 1000
                    )
                    if (result.event === 'Staked') {
                        const stakedBytes: Uint8Array =
                            ethers.utils.toUtf8Bytes(signatureStakedEvent)
                        ethers.utils.keccak256(stakedBytes)
                        const token = ethers.utils.defaultAbiCoder
                            .decode(['string'], result.data)[0]
                            .toString()
                        t.push({
                            amount: amount,
                            investor: result.args['investor'],
                            token: token,
                            type: result.event,
                            date: d,
                        })
                    }
                    if (result.event === 'Unstaked') {
                        const unstakedBytes: Uint8Array =
                            ethers.utils.toUtf8Bytes(signatureUnstakedEvent)
                        ethers.utils.keccak256(unstakedBytes)
                        const token = ethers.utils.defaultAbiCoder
                            .decode(['string'], result.data)[0]
                            .toString()
                        t.push({
                            amount: amount,
                            investor: result.args['investor'],
                            token: token,
                            type: result.event,
                            date: d,
                        })
                    }
                }
            })
            setTransactions(
                t.sort((a, b) => a.date.getTime() - b.date.getTime())
            )
        }
        getHistory()
    }, [])

    return (
        <div className="min-h-screen">
            <ToastContainer
                position="top-center"
                style={{ width: 'max-content' }}
            />
            <div className="bg-black pb-20">
                <Nav
                    setAccount={setAccount}
                    toggle={toggle}
                    setToggle={setToggle}
                    setIsConnected={setIsConnected}
                    setCurrencyCode={setCurrencyCode}
                    isConnected={isConnected}
                    account={account}
                />
                <div className="lg:w-11/12 mx-auto p-4">
                    <h1 className="font-bold text-2xl text-white">
                        {' '}
                        Transaction History
                    </h1>
                </div>
            </div>

            <div className="lg:w-11/12 mx-auto px-4 flex flex-wrap gap-5 relative bottom-10">
                <div className="round-md shadow-md bg-white p-8 w-full flex flex-col">
                    <table>
                        <thead>
                            <tr className="text-left text-sm opacity-70">
                                <th className="lg:p-3 md:p-1">Investor</th>
                                <th className="lg:p-3 md:p-1">Token</th>
                                <th className="lg:p-3 md:p-1">Amount</th>
                                <th className="lg:p-3 md:p-1">Timestamp</th>
                                <th className="lg:p-3 md:p-1">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(transaction => (
                                <Transaction event={transaction} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default History
