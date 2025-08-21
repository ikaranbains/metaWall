import React, { useEffect, useState } from "react";
import {
	MdOutlineKeyboardArrowDown,
	MdOutlineKeyboardArrowLeft,
	MdOutlineQrCodeScanner,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import DeterministicPieIcon from "./common/DeterministicPieIcon";
import { IoClose } from "react-icons/io5";
import { useNetwork } from "../context/NetworkContext";
import { isValidWalletAddress } from "../utils/validation";
import toast from "react-hot-toast";
import { useSend } from "../context/TxContext";
import Loader from "./common/Loader";

const Send = () => {
	const navigate = useNavigate();
	const { walletAddress } = useWallet();
	const { addressInput, setAddressInput, amtInput, setAmtInput } = useSend();
	const [showStep2, setShowStep2] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const { selectedOption } = useNetwork();
	const [balance, setBalance] = useState("");
	const [loading, setLoading] = useState(false);

	const getCachedBalance = () => {
		const chainId = localStorage.getItem("chainId");
		if (!chainId) return console.log("no chainid found");
		const key = `cachedBalance_${chainId}_${walletAddress}`;
		const localBalance = localStorage.getItem(key);
		setBalance(localBalance);
	};

	const handleNext = (e) => {
		e.preventDefault();
		if (!addressInput || addressInput === "")
			return console.log("Address Input in required");
		const isValid = isValidWalletAddress(addressInput);
		if (!isValid) return toast.error("Please enter valid address!!");
		setShowStep2(true);
		localStorage.setItem("toAddress", addressInput);
		// e.stopPropagation();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!amtInput || amtInput === "")
			return toast.error("Amount is required!!");
		const amt = parseFloat(amtInput);
		const blcFloat = parseFloat(balance);
		if (blcFloat <= amt) return toast.error("Insufficient Funds!!");
		console.log("Sent!!");
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			navigate("/review");
		}, 1500);

		// setAmtInput("");
	};

	useEffect(() => {
		getCachedBalance();
	}, []);

	return (
		<div className="w-full h-full flex items-center justify-center">
			{loading && <Loader />}
			<div className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-300 bg-white mt-13 w-[65%] m-auto min-h-[87vh] flex flex-col">
				<div className="w-[53%] flex mt-3 items-center justify-between">
					<span
						onClick={() => navigate("/home")}
						className="pl-3 cursor-pointer"
					>
						<MdOutlineKeyboardArrowLeft size={24} />
					</span>
					<h2 className="font-semibold text-xl">Send</h2>
				</div>
				<div className="mt-10 h-190 flex flex-col justify-between pb-10 px-5">
					<div className="flex flex-col gap-10">
						<section>
							<p className="text-lg">From</p>
							<div className="border border-gray-300 mt-2 rounded-lg py-2 px-3 flex items-center justify-between">
								<div className="flex items-center  gap-5">
									{walletAddress && (
										<DeterministicPieIcon address={walletAddress} size={18} />
									)}
									<div>
										<p>Account 1</p>
										<p className="text-sm text-gray-400">
											{walletAddress
												? `${walletAddress.slice(0, 6)}...${walletAddress.slice(
														-7
												  )}`
												: "not found"}
										</p>
									</div>
								</div>
								<span className="cursor-pointer">
									<MdOutlineKeyboardArrowDown size={22} />
								</span>
							</div>
							{showStep2 && (
								<>
									<div className="border border-gray-300 mt-5 rounded-lg py-3 px-3 flex items-center justify-between">
										<div className="bg-zinc-200 rounded px-3 py-2">
											{selectedOption?.label}
										</div>
										<form
											id="toForm"
											onSubmit={(e) => handleSubmit(e)}
											className="flex w-[7vw] items-center justify-center"
										>
											<input
												value={amtInput}
												type="number"
												name="address"
												placeholder="0"
												className="w-full text-right placeholder:text-right outline-none py-1 px-2 font-thin text-md bg-transparent"
												onChange={(e) => {
													setAmtInput(e.target.value);
													setDisabled(false);
												}}
											/>
										</form>
									</div>
									<span className="text-sm text-gray-500 pl-1">
										Balance: {balance}
									</span>
								</>
							)}
						</section>
						<section>
							<p className="text-lg">To</p>

							{!showStep2 ? (
								<form
									id="addressForm"
									onSubmit={(e) => handleNext(e)}
									className="flex w-full mt-2 items-center justify-center rounded-lg border py-4 border-gray-300"
								>
									<input
										// value={addressInput}
										type="text"
										name="address"
										placeholder="Enter public address (0x)..."
										className="w-[60vw] border-none outline-none font-thin text-md"
										onChange={(e) => {
											setAddressInput(e.target.value);
											setDisabled(false);
										}}
									/>
									<span className="cursor-pointer">
										<MdOutlineQrCodeScanner size={22} />
									</span>
								</form>
							) : (
								<div className="border border-gray-300 mt-5 rounded-lg py-2 px-3 flex items-center justify-between">
									<div className="flex items-center py-2 gap-5">
										{addressInput && (
											<DeterministicPieIcon address={addressInput} size={18} />
										)}
										<div>
											<p className="text-black">
												{addressInput
													? `${addressInput.slice(0, 7)}...${addressInput.slice(
															-6
													  )}`
													: "not found"}
											</p>
										</div>
									</div>
									<span
										onClick={() => setShowStep2(false)}
										className="cursor-pointer"
									>
										<IoClose size={20} />
									</span>
								</div>
							)}
						</section>
					</div>
					<div className="flex items-center justify-between gap-3">
						<button
							onClick={() => navigate("/home")}
							className=" bg-gray-200 cursor-pointer w-1/2 py-2 text-lg rounded-lg hover:bg-gray-300 "
						>
							Cancel
						</button>
						{!showStep2 ? (
							<button
								form="addressForm"
								type="submit"
								disabled={disabled}
								className={`text-white w-1/2 py-2 text-lg rounded-lg ${
									!disabled
										? "bg-black hover:bg-zinc-900 cursor-pointer"
										: "bg-zinc-400 cursor-not-allowed"
								}`}
							>
								Next
							</button>
						) : (
							<button
								form="toForm"
								type="submit"
								disabled={disabled}
								className={`text-white w-1/2 py-2 text-lg rounded-lg ${
									!disabled
										? "bg-black hover:bg-zinc-900 cursor-pointer"
										: "bg-zinc-400 cursor-not-allowed"
								}`}
							>
								Continue
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Send;
