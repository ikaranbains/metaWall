import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import NetworkSelector from "./NetworkSelector";
import { GoArrowUpRight } from "react-icons/go";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import Menu from "./Menu";
import Accounts from "./Accounts";
import { useNetwork } from "../context/NetworkContext";
import ActivityBar from "./ActivityBar";

import { useWallet } from "../context/WalletContext";

const Home = () => {
	const { walletAddress } = useWallet();
	const { selectedOption, setSelectedOption, balance, setBalance } =
		useNetwork();

	const handleChange = async (option) => {
		setSelectedOption(option);
		toast.success("Chain changed to " + option?.label);
		localStorage.setItem("chainId", option?.chainId);
	};

	

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
