import React,{useState, useEffect} from "react";
import {ReactComponent as Metamask } from "./svg/metamask.svg";
import {FaBars} from "react-icons/fa";
import { fetchCoins } from "./api/tokens";
import Loader from "./components/Loader";
import Assets from "./components/Assets";
import { ToastContainer } from 'react-toastify';
import TopOfTheDaySection from "./components/TopOfTheDaySection";
import 'react-toastify/dist/ReactToastify.css';
import Coin from "./api/Coin";
import Account from "./components/Account";
import Currencies from "./components/Currencies";
import StakeModal from "./components/StakeModal";

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
      }); 
  },[]);

  const connectWallet = async () => {
    if (window.ethereum){
       window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts: string[]) => setAccount(accounts[0]));
    }
  }

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-center" style={{width: "max-content"}}/>
      <div className="bg-black pb-20">
        <div className="lg:w-11/12 mx-auto p-4"> 
              <button className="lg:hidden" onClick={() => setToggle(!toggle)}>
                <FaBars className="text-white text-2xl"/>
              </button>
              <nav className= {`transition duration-500 ease-in-out flex flex-col lg:flex-row py-5 gap-2 justify-end lg:flex ${toggle ? "flex" : "hidden"}`} id="nav_content">
                  {
                    isConnected ? <div className="flex flex-col lg:flex-row flex-wrap gap-2 items-center">
                                    <Currencies setCurrencyCode={setCurrencyCode}/>
                                    <Account account={account}/>
                                  </div> 
                    :  <div className="flex flex-col lg:flex-row flex-wrap gap-2 items-center">
                        <Currencies setCurrencyCode={setCurrencyCode}/>
                        <button className="transition duration-500 ease-in-out text-green-400 hover:bg-green-400 hover:text-white text-lg border-2 border-green-400 py-1 px-4 rounded-sm font-medium flex items-center gap-2 w-max" onClick={() => connectWallet()}><Metamask className="w-6 h-auto"/>  Metamask </button>
                      </div> 
                  }   
              </nav>
        </div>
        <div className="lg:w-11/12 mx-auto p-4">
          <h1 className="font-bold text-2xl text-white"> Daily Overview</h1> 
        </div>
      </div>
      <TopOfTheDaySection coins={coins} setLoading={setLoading} loading={loading}/>
      <StakeModal coin={currentCoin} showModal={showModal} setShowModal={setShowModal} account={account}/>
        <div className="lg:w-11/12 mx-auto px-4"> 
          <div className="w-full py-6">
              <div className="flex flex-col gap-2 rounded-md shadow-md bg-white p-6">
                {
                  loading === false ? <Loader />
                  : <Assets coins={coins} setCurrentCoin={setCurrentCoin} setShowModal={setShowModal} currencycode={currencycode}/>
                }
              </div>
         </div>
      </div>
    </div>
  )
}

export default App;
