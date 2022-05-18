import React,{useState, useEffect} from "react";
import {ReactComponent as Metamask } from "./svg/metamask.svg";
import {FaBars} from "react-icons/fa";
import { fetchCoins } from "./api/tokens";
import Loader from "./components/Loader";
import Assets from "./components/Assets";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Coin from "./api/Coin";


const App : React.FC = () => {

  const [toggle, setToggle] = useState<boolean>(false);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentCoin, setCurrentCoin] = useState<Coin | undefined>(undefined);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [account, setAccount] = useState<string | undefined>(undefined);
  const [currencycode, setCurrencyCode] = useState<string>("usd");

  const isConnected: boolean = (account !== undefined) ? true : false;

  useEffect(()=> {
    fetchCoins().then(data => {
      setCoins(data);
      setLoading(true);
      }); 
  },[]);

  const connectWallet = async () => {
    if (window.ethereum){
       window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts: string[]) => setAccount(accounts[0]));
    }
  }

  return (
    <div className="lg:w-11/12 mx-auto px-4"> 
          <div className="w-full py-6">
              <div className="flex flex-col gap-2 rounded-md shadow-md bg-white p-6">
                {
                  loading === false ? <Loader />
                  : <Assets coins={coins} setCurrentCoin={setCurrentCoin} setShowModal={setShowModal} currencycode={currencycode} />
                }
              </div>
         </div>
      </div>
  )
}

export default App;
