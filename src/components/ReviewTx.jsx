import React, { useEffect, useState } from "react";
import { MdArrowForwardIos, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSend } from "../context/TxContext";
import { useNetwork } from "../context/NetworkContext";
import DeterministicPieIcon from "./common/DeterministicPieIcon";
import { useWallet } from "../context/WalletContext";
import Web3 from "web3";
import Loader from "./common/Loader";
import toast from "react-hot-toast";
import TxSuccessModal from "./modals/TxSuccessModal";
import { calculateGasFee, sendTx } from "../utils/web3Fns";

const ReviewTx = () => {
	const navigate = useNavigate();
	const { addressInput, amtInput, privateKey } = useSend();
	const { selectedOption } = useNetwork();
	const web3 = new Web3(selectedOption?.rpc);
	const { walletAddress } = useWallet();
	const [networkFee, setNetworkFee] = useState(null);
	const [nonce, setNonce] = useState(null);
	const [loading, setLoading] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [gasPrice, setGasPrice] = useState("");
	const [gasLimit, setGasLimit] = useState("");

	const sendTxToNetwork = async () => {
		try {
			setLoading(true);
			const receipt = await sendTx({
				web3,
				from: walletAddress,
				to: addressInput,
				amt: amtInput,
				gas: gasLimit,
				gasPrice,
				nonce,
				privateKey,
			});

			console.log("Tx receipt -------- ", receipt);
			toast.success("Transaction successfull");
			setLoading(false);
			setShowSuccess(true);
			setTimeout(() => {
				setShowSuccess(false);
				navigate("/home");
			}, 3000);
		} catch (error) {
			console.error("Tx error: ", error);
			toast.error("Tx Failed!!");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const fetchFee = async () => {
			if (!walletAddress || !addressInput || !selectedOption) return;

			try {
				const { gasPrice, gasLimit, totalFeeEther } = await calculateGasFee({
					web3,
					from: walletAddress,
					to: addressInput,
					amt: amtInput,
				});
				setGasPrice(gasPrice);
				setGasLimit(gasLimit);
				setNetworkFee(totalFeeEther);
			} catch (error) {
				console.error("Error fetching network fee:", error);
			}
		};

		const getNonce = async () => {
			try {
				const txNonce = await web3.eth.getTransactionCount(
					walletAddress,
					"latest"
				);

				setNonce(Number(txNonce));
			} catch (err) {
				console.error("Error fetching nonce:", err);
			}
		};

		fetchFee();
		getNonce();
	}, [walletAddress, amtInput, addressInput]);

	return (
		<div className="relative w-full h-full flex items-center justify-center">
			{loading && <Loader />}
			{showSuccess && (
				<TxSuccessModal
					show={showSuccess}
					onClose={() => setShowSuccess(false)}
				/>
			)}
			<div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-[#f3f5f9] mt-18 w-[60%] m-auto min-h-[85vh] flex flex-col border border-zinc-200">
				<nav className="w-full bg-[#ffff] h-15 flex items-center">
					<span
						onClick={() => navigate("/send")}
						className="pl-3 cursor-pointer"
					>
						<MdOutlineKeyboardArrowLeft size={24} />
					</span>
					<h2 className="font-medium text-2xl m-auto">Review</h2>
				</nav>

				<div className="w-full h-190 flex flex-col items-center justify-between">
					<div className="w-full h-120 pt-10 px-4 flex flex-col gap-6">
						<h2 className="text-3xl font-bold text-center">
							{amtInput ? amtInput : "0.0001"}{" "}
							{selectedOption?.nativeCurrency?.symbol}
						</h2>
						<div className="flex flex-col items-center gap-4 mt-6">
							<div className="w-full bg-white h-20 rounded-lg flex items-center justify-between px-4">
								<div className="flex flex-col gap-0.5">
									<p>From</p>
									<div className="bg-[#eceeff] w-27 flex gap-1 items-center justify-center rounded-xl">
										<DeterministicPieIcon address={walletAddress} size={18} />
										<p className="text-blue-700">Account 1</p>
									</div>
								</div>
								<span className="text-gray-400 ml-20">
									<MdArrowForwardIos size={22} />
								</span>
								<div className="flex flex-col gap-0.5">
									<p>To</p>
									<div className="bg-[#eceeff] min-w-27 gap-1 flex items-center justify-center rounded-xl px-0.5">
										<DeterministicPieIcon address={addressInput} size={18} />
										<p className="text-blue-700">
											{addressInput
												? `${addressInput.slice(0, 7)}...${addressInput.slice(
														-6
												  )}`
												: "not found"}
										</p>
									</div>
								</div>
							</div>

							<div className="w-full bg-white h-15 rounded-lg flex items-center justify-between px-4">
								<p>Network</p>
								<div className="bg-zinc-100 rounded px-3 py-1 font-medium">
									{selectedOption?.label}
								</div>
							</div>

							<div className="w-full bg-white h-15 rounded-lg flex items-center justify-between px-4">
								<p>Network Fee</p>
								<p>
									{networkFee ? (
										`${networkFee} ${
											selectedOption.chainId === 11155111 ? "ETH" : "Matic"
										}`
									) : (
										<span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-black/30 border-t-black" />
									)}
								</p>
							</div>

							<div className="w-full bg-white h-15 rounded-lg flex items-center justify-between px-4">
								<p>Nonce</p>
								<p>
									{nonce ? (
										nonce
									) : (
										<span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-black/30 border-t-black" />
									)}
								</p>
							</div>
						</div>
					</div>

					<div className="w-full py-4 px-4 flex items-center justify-between gap-3 bg-white">
						<button
							onClick={() => navigate("/home")}
							className=" bg-gray-200 cursor-pointer w-1/2 py-2 text-lg rounded-lg hover:bg-gray-300 "
						>
							Cancel
						</button>
						<button
							onClick={sendTxToNetwork}
							className="text-white w-1/2 py-2 text-lg rounded-lg bg-black hover:bg-zinc-900 cursor-pointer"
						>
							Confirm
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReviewTx;
