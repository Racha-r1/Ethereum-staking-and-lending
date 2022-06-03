import React from 'react'
import { FaBars } from 'react-icons/fa'
import Currencies from '../components/Currencies'
import Account from '../components/Account'
import { ReactComponent as Metamask } from '../svg/metamask.svg'
import logo from '../images/logo_transparent.png'
import { Link } from 'react-router-dom'

interface Props {
    toggle: boolean
    setToggle: React.Dispatch<React.SetStateAction<boolean>>
    account: string | undefined
    setAccount: React.Dispatch<React.SetStateAction<string | undefined>>
    isConnected: boolean
    setIsConnected: React.Dispatch<React.SetStateAction<boolean>>
    setCurrencyCode: React.Dispatch<React.SetStateAction<string>>
}

const Nav: React.FC<Props> = ({
    toggle,
    setToggle,
    account,
    setAccount,
    isConnected,
    setIsConnected,
    setCurrencyCode,
}) => {
    const connectWallet = () => {
        if (window.ethereum) {
            window.ethereum
                .request({ method: 'eth_requestAccounts' })
                .then((accounts: string[]) => setAccount(accounts[0]))
                .then(() => setIsConnected(true))
        }
    }
    return (
        <div className="lg:w-11/12 mx-auto p-4">
            <button className="lg:hidden" onClick={() => setToggle(!toggle)}>
                <FaBars className="text-white text-2xl" />
            </button>
            <nav
                className={`transition duration-500 ease-in-out flex flex-col lg:flex-row py-5 gap-2 justify-end lg:flex ${
                    toggle ? 'flex' : 'hidden'
                }`}
                id="nav_content"
            >
                {isConnected ? (
                    <>
                        <Link className="absolute left-9 top-2" to="/">
                            <img src={logo} className="w-16" />
                        </Link>
                        <div className="flex flex-col-reverse lg:flex-row flex-wrap gap-2 lg:items-center">
                            <Currencies setCurrencyCode={setCurrencyCode} />
                            <Account account={account} />
                        </div>
                    </>
                ) : (
                    <>
                        <Link className="absolute left-9 top-2" to="/">
                            <img src={logo} className="w-24" />
                        </Link>
                        <div className="flex flex-col-reverse lg:flex-row flex-wrap gap-2 lg:items-center">
                            <Currencies setCurrencyCode={setCurrencyCode} />
                            <button
                                className="transition duration-500 ease-in-out text-green-400 hover:bg-green-400 hover:text-white text-lg border-2 border-green-400 py-1 px-4 rounded-sm font-medium flex items-center gap-2 w-max"
                                onClick={() => connectWallet()}
                            >
                                <Metamask className="w-6 h-auto" /> Metamask{' '}
                            </button>
                        </div>
                    </>
                )}
            </nav>
        </div>
    )
}

export default Nav
