import Head from "next/head";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import AliveCore from "../artifacts/AliveCore.json";
const aliveCoreAddress = "0x71eBbCC12b378BB9e1d5a94Ce68522907FEd26CA";
const Home = () => {
  const [bandAddresses, setbandAddresses] = useState([]);
  const [Network, setNetwork] = useState(null)
  const [account, setAccount] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkWalletConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Install Metamask");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found Account, ", account);
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let network = await provider.getNetwork();
      setAccount(account);
      setNetwork(network.name);
      if (network.name !== "maticmum") {
        console.log("Wrong network");
      } else {
        console.log("maticmum connected");
      }
    } else {
      console.log("Create a Ethereum Account");
    }
  };
  const login = async () => {
    try {
      checkWalletConnected();
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Install Metamask");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected, ", accounts[0]);
      setAccount(accounts[0]);
      setIsAuthenticated(true);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => checkWalletConnected, []);

  useEffect(() => {
    console.log(account);
  }, [account]);

  async function createCollection() {
    setIsLoading(true);
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let alive = new ethers.Contract(aliveCoreAddress, AliveCore.abi, signer);
    try {
      //using code from deployer.js (backend/scripts)
      let createBand = await alive.createBand(); // creates a empty band
      await createBand.wait();
      console.log("Band created", createBand);
      setIsLoading(false);
    } catch (error) {
      setError(error);
    }
  }

  async function getAddresses() {
    setIsLoading(true);
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let alive = new ethers.Contract(aliveCoreAddress, AliveCore.abi, signer);
    try {
      let allbands = await alive.returnAllBands();
      console.log("band created", "all bands", allbands);
      setbandAddresses(allbands);
      setIsLoading(false);
    } catch (error) {
      setError(error);
    }
  }

  return (
    <div className="">
      <Head>
        <title>Alive Collection</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="flex justify-around p-6 text-xl	">
        <h1>Alive</h1>
        <button
          onClick={login}
          className=" cursor-pointer bg-yellow-100  p-2 text-gray-800"
        >
          {account
            ? `${account.slice(0, 4)} ... ${account.slice(
                account.length - 3,
                account.length
              )}`
            : "Connect to Wallet"}
        </button>
      </nav>

      <main className=" flex w-full flex-col items-center justify-center gap-4 text-white ">
      {Network && (
        <div>
          Network: {Network}
        </div>
      )}
        <div className="flex p-5 ">
          <button
            onClick={createCollection}
            className="m-5 cursor-pointer  rounded border bg-gradient-to-r from-pink-500/70 to-yellow-500/50 py-2 px-4 font-semibold text-white shadow-lg shadow-red-500 hover:shadow-md hover:shadow-yellow-300/50"
          >
            Deploy a band
          </button>
          <button
            onClick={getAddresses}
            className="m-5 cursor-pointer  rounded border bg-gradient-to-r from-pink-500/70 to-yellow-500/50 py-2 px-4 font-semibold text-white shadow-lg shadow-red-500 hover:shadow-md hover:shadow-yellow-300/50"
          >
            Get bands
          </button>
        </div>
      </main>
      {error && (
        <p className="bg-red-700 text-center font-medium text-white opacity-60 ">
          TRANSACTION FAILED: {error.message}
        </p>
      )}

      {isLoading && (
        <div className="flex items-center justify-center">loading....</div>
      )}
      {!error &&
        bandAddresses.length > 0 &&
        bandAddresses.map((band, index) => {
          {/* let id = new ethers.BigNumber(band.bandId); */}
          return(
          <div>
            <h2>Band Address: {band.bandAddress}</h2>
            <h2>Band Deployer: {band.deployer}</h2>
            {/* <h2>Band ID: {id.toNumber()}</h2> */}
            <button className="m-4 bg-orange-500 p-4 text-xl">
              <a
                href={`https://mumbai.polygonscan.com/address/${band.bandAddress}`}
                target="_blank"
                rel="noreferrer"
              >
                POLYGON SCAN LINK OF BAND
              </a>
            </button>
          </div>
        )})}
    </div>
  );
};

export default Home;
