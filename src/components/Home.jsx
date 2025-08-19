import { use, useEffect, useState } from "react";
import { getDataById } from "../utils/idb";
import toast from "react-hot-toast";
import NetworkSelector from "./NetworkSelector";
import { GoArrowUpRight } from "react-icons/go";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import Menu from "./Menu";
import Accounts from "./Accounts";
import { useNetwork } from "../context/NetworkContext";
import ActivityBar from "./ActivityBar";
import Web3 from "web3";
import { chainConfigs } from "../utils/constants";
import { useWallet } from "../context/WalletContext";
import useUser from "../hooks/useUser";

const Home = () => {
	const { walletAddress } = useWallet();
	const { selectedOption, setSelectedOption } = useNetwork();
	const [balance, setBalance] = useState("0");
	const [web3Provider, setWeb3Provider] = useState(null);

	const handleChange = async (option) => {
		setSelectedOption(option);
		// const selected = {...option};
		// const web3 = new Web3(selected?.rpc || chainConfigs[0]?.rpc);
		toast.success("Chain changed to " + option?.label);
		// const getChain = await web3.eth.getChainId();
		// console.log(getChain);
	};

	const getBalance = async () => {
		try {
			if (!web3Provider) return console.log("no provider found");

			const balanceWei = await web3Provider.eth.getBalance(walletAddress);
			const balanceEth = web3Provider.utils.fromWei(balanceWei, "ether");
			const formattedBalance = parseFloat(balanceEth).toLocaleString(
				undefined,
				{
					minimumFractionDigits: 0,
					maximumFractionDigits: 6,
				}
			);
			setBalance(formattedBalance);
			localStorage.setItem("cachedBalance", formattedBalance);
			console.log("✅ Balance Fetched Successfully");
		} catch (error) {
			console.log("❌ error balance - ", error);
		}
	};

	useEffect(() => {
		try {
			const option = { ...selectedOption };
			if (!option) console.log("No option found!!");

			const provider = new Web3(option?.rpc || chainConfigs?.[0]?.rpc);

			if (!provider) console.log("No Provider");

			setWeb3Provider(provider);
			console.log("Provider set successfully!!");
		} catch (error) {
			console.log("error getting provider!!", error);
		}
	}, [selectedOption]);

	useEffect(() => {
		try {
			if (web3Provider && walletAddress) getBalance();
		} catch (error) {
			console.log("error", error);
		}
	}, [selectedOption, web3Provider, walletAddress]);

	useEffect(() => {
		const cached = localStorage.getItem("cachedBalance");
		if (cached) setBalance(cached);
	}, []);

	return (
		<div className="w-full h-screen overflow-x-hidden">
			<div className="w-full h-screen bg-[#f3f5f9] absolute"></div>
			<div className="absolute w-full z-[99]">
				<h2 className="font-bold text-xl text-center mt-10 leading-none">
					meta
				</h2>
				<h2 className="font-bold text-3xl text-center leading-none">Wall</h2>
				<div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white mt-8 w-[65%] m-auto min-h-[87vh] flex items-center flex-col">
					<div className="w-full h-20 flex items-center justify-between px-10 border-b border-zinc-200">
						<div>
							<NetworkSelector
								selectedOption={selectedOption}
								handleChange={handleChange}
							/>
						</div>
						<Accounts address={walletAddress} />
						<Menu />
					</div>

					<div className="w-full h-60 flex flex-col items-center pt-10">
						<h2 className="text-[2.1vw]">{`${balance} ${selectedOption?.nativeCurrency?.symbol}`}</h2>
						<div className="pt-7 flex items-center justify-center gap-10">
							<div className="flex items-center justify-center flex-col">
								<span className="w-10 h-10 inline-flex rounded-full items-center justify-center bg-zinc-200 cursor-pointer hover:bg-zinc-300">
									<GoArrowUpRight />
								</span>
								Send
							</div>
							<div className="flex items-center justify-center flex-col">
								<span className="w-10 h-10 inline-flex rounded-full items-center justify-center bg-zinc-200 cursor-pointer hover:bg-zinc-300">
									<MdOutlineQrCodeScanner />
								</span>
								Receive
							</div>
						</div>
					</div>

					<ActivityBar />
				</div>
			</div>
		</div>
	);
};

export default Home;
