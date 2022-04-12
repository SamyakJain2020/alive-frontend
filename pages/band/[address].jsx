import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { MultiSelect } from "@mantine/core";
import Band from "../../artifacts/N456Factory.json";

const Home = () => {
  const router = useRouter();
  const { address } = router.query;
  // console.log(address);
  const [data, setData] = useState([]);
  const [bandName, setbandName] = useState([]);
  const [bandMembers, setBandMembers] = useState([]);
  const [Network, setNetwork] = useState(null);
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

  useEffect(() => checkWalletConnected, [account]);

  // useEffect(() => {
  //   console.log(account);
  // }, [account]);

  async function addBandMembers() {
    setIsLoading(true);
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let band = new ethers.Contract(address, Band.abi, signer);
    try {
      //using code from deployer.js (backend/scripts)
      let txn = await band.addMemberBulk(data); // creates a empty band
      await txn.wait();
      console.log("Members added:", txn);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  }

  async function getAddresses() {
    setIsLoading(true);
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let alive = new ethers.Contract(address, Band.abi, signer);
    try {
      let allbands = await alive.membersOfBand(0);
      console.log("band members", allbands);
      // setbandAddresses(allbands);
      setBandMembers(allbands);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  }
  async function createNewSong() {
    setIsLoading(true);
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let alive = new ethers.Contract(address, Band.abi, signer);
    try {
      let createClone = await alive.createNewSong(
        account,
        1,
        10,
        20,
        500,
        {
          gasLimit: 800000,
        }
      ); // 5% in erc2981
      let txnc = await createClone.wait();
      console.log("address of the clone - ", createClone);
      const event = txnc.events.find((event) => event.event === "N456Created");
      // console.log(event);
      const [address] = event.args;
      console.log(address);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
      console.error(error);
    }
  }
  async function getSongs() {
    setIsLoading(true);
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let alive = new ethers.Contract(address, Band.abi, signer);
    try {
      let allSongs = await alive.getAllSongs();
      console.log("Band Songs", allSongs);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
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
        {Network && <div>Network: {Network}</div>}
        <div className="flex  flex-col p-5 ">
          <div className="flex flex-col items-center justify-center gap-4 text-white ">
            <label htmlFor=" bandName" className="leading-7 text-sm text-gray-600">
              Add Band Members:
            </label>
            {/* <input
                type="text"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                name="bandName"
                value={bandName}
                placeholder="Band Name"
                onChange={(e) => setbandName(e.target.value)}
              /> */}

            <MultiSelect
              // label="Creatable MultiSelect"
              data={data}
              placeholder="Add band Members"
              searchable
              creatable
              getCreateLabel={(query) => `+ Create ${query}`}
              onCreate={(query) => setData((current) => [...current, query])}
            />
          </div>
          <button
            onClick={addBandMembers}
            className="m-5 cursor-pointer  rounded border bg-gradient-to-r from-pink-500/70 to-yellow-500/50 py-2 px-4 font-semibold text-white shadow-lg shadow-red-500 hover:shadow-md hover:shadow-yellow-300/50"
          >
            Add Band Members
          </button>
          <button
            onClick={getAddresses}
            className="m-5 cursor-pointer  rounded border bg-gradient-to-r from-pink-500/70 to-yellow-500/50 py-2 px-4 font-semibold text-white shadow-lg shadow-red-500 hover:shadow-md hover:shadow-yellow-300/50"
          >
            Get band Members
          </button>
          <button
            onClick={createNewSong}
            className="m-5 cursor-pointer  rounded border bg-gradient-to-r from-pink-500/70 to-yellow-500/50 py-2 px-4 font-semibold text-white shadow-lg shadow-red-500 hover:shadow-md hover:shadow-yellow-300/50"
          >
            Create New Song(parameters hardcoded)
          </button>
           <button
            onClick={getSongs}
            className="m-5 cursor-pointer  rounded border bg-gradient-to-r from-pink-500/70 to-yellow-500/50 py-2 px-4 font-semibold text-white shadow-lg shadow-red-500 hover:shadow-md hover:shadow-yellow-300/50"
          >
            GET ALL SONGS
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

      {/* {!error &&
        bandAddresses.length > 0 &&
        bandAddresses.map((band, index) => {
          return(
          <div key={index} >
            <h2>Band Address: {band.bandAddress}</h2>
            <h2>Band Deployer: {band.deployer}</h2>
            <button className="m-4 bg-orange-500 p-4 text-xl">
              <Link
                href={`https://mumbai.polygonscan.com/address/${band.bandAddress}`}>
              <a
                target="_blank"
                rel="noreferrer"
              >
                POLYGON SCAN LINK OF BAND
              </a>
              </Link>
            </button>
          </div>
        )})} */}

      {!error &&
        bandMembers.length > 0 &&
        bandMembers.map((addresses, index) => {
          return (
            <div key={index}>
              <h2>hi</h2>
              {/* <h2>Band Address: {addresses.bandAddress}</h2> */}
            </div>
          );
        })}
    </div>
  );
};

export default Home;
