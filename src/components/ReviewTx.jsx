import { useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSend } from "../context/TxContext";
import { useNetwork } from "../context/NetworkContext";
import DeterministicPieIcon from "./common/DeterministicPieIcon";
import Web3 from "web3";
import Loader from "./common/Loader";
import toast from "react-hot-toast";
import TxSuccessModal from "./modals/TxSuccessModal";
import {
	calculateGasFee,
	calculateGasFeeToken,
	calculateSolFee,
	getNonce,
	sendEVMTx,
	sendSolTx,
	sendTokenTx,
} from "../utils/web3Fns";
import Address from "./common/Address";
import TxButtons from "./buttons/TxButtons";
import DataStrip from "./common/DataStrip";
import TxHeader from "./common/TxHeader";
import ERC20ABI from "../ABI/TOKEN_ABI.json";
import { useAccounts } from "../context/AccountsContext";
import {
	clusterApiUrl,
	Connection,
	PublicKey,
	SystemProgram,
	Transaction,
} from "@solana/web3.js";
import { getKeys } from "../utils/utilityFn";

const ReviewTx = () => {
	const navigate = useNavigate();
	const { addressInput, amtInput, privateKey, secretKey, selectedAsset } =
		useSend();
	const { selectedOption, setBalance } = useNetwork();
	const web3 = new Web3(selectedOption?.rpc);
	const connection = new Connection(
		selectedOption?.rpc || clusterApiUrl("devnet"),
		"confirmed"
	);
	const { selectedAccount } = useAccounts();
	const walletAddress = selectedAccount?.address;
	const accountName = selectedAccount?.name;
	const [networkFee, setNetworkFee] = useState(null);
	const [solNetworkFee, setsolNetworkFee] = useState(null);
	const [nonce, setNonce] = useState(null);
	const [loading, setLoading] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [gasPrice, setGasPrice] = useState("");
	const [gasLimit, setGasLimit] = useState("");
	const chainId = Number(localStorage.getItem("chainId"));
	const contract = new web3.eth.Contract(ERC20ABI, selectedAsset?.address);

	// console.log("amount -----------", typeof amtInput)

	const sendTxToNetwork = async () => {
		try {
			setLoading(true);
			let receipt;
			if (selectedAccount?.type === "evm") {
				receipt = await sendEVMTx({
					web3,
					from: walletAddress,
					to: addressInput,
					amt: amtInput,
					gasLimit,
					gasPrice,
					nonce,
					privateKey,
				});
			}
			if (selectedAccount?.type === "sol") {
				receipt = await sendSolTx({
					connection,
					from: walletAddress,
					to: addressInput,
					amount: amtInput,
					secretKey,
				});
			}

			console.log("Tx receipt -------- ", receipt);
			toast.success("Transaction successfull");

			let freshBalance;
			if (selectedAccount?.type === "evm") {
				const balanceWei = await web3.eth.getBalance(walletAddress);
				freshBalance = web3.utils.fromWei(balanceWei, "ether");
			} else if (selectedAccount?.type === "sol") {
				const lamports = await connection.getBalance(
					new PublicKey(walletAddress)
				);
				freshBalance = lamports / 10 ** 9;
			}

			// also update context state balance
			freshBalance = freshBalance.toFixed(8);
			setBalance(freshBalance);

			// note: update token list
			const chainId = selectedOption?.chainId || null;
			const { tokenKey } = getKeys(chainId, walletAddress);
			const tokensList = JSON.parse(localStorage.getItem("tokensList") || "{}");
			if (tokensList[tokenKey]) {
				tokensList[tokenKey] = tokensList[tokenKey].map((t) =>
					t.tokenType === "native"
						? { ...t, formattedBalance: freshBalance }
						: t
				);
				// console.log(tokensList);
				localStorage.setItem("tokensList", JSON.stringify(tokensList));
			}

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

	const sendTokenTxToNetwork = async () => {
		try {
			setLoading(true);

			const receipt = await sendTokenTx({
				web3,
				from: walletAddress,
				to: addressInput,
				amt: amtInput,
				gasLimit,
				gasPrice,
				nonce,
				privateKey,
				contract,
				selectedAsset,
			});

			console.log("Tx receipt -------- ", receipt);
			toast.success("Transaction successfull");
			await getBalance();
			setLoading(false);
			setShowSuccess(true);
			setTimeout(() => {
				setShowSuccess(false);
				navigate("/home");
			}, 3000);
		} catch (error) {
			console.error("TokenTx error: ", error);
			toast.error("TokenTx Failed!!");
		} finally {
			setLoading(false);
		}
	};

	const handleSend = () => {
		if (selectedAsset?.tokenType === "native") {
			sendTxToNetwork();
		} else {
			sendTokenTxToNetwork();
		}
	};

	useEffect(() => {
		const fetchEVMFee = async () => {
			if (!walletAddress || !addressInput || !selectedOption) return;

			try {
				let fee;
				if (selectedAsset && selectedAsset?.tokenType === "native") {
					fee = await calculateGasFee({
						web3,
						from: walletAddress,
						to: addressInput,
						amt: amtInput,
					});
				} else {
					fee = await calculateGasFeeToken({
						web3,
						from: walletAddress,
						to: addressInput,
						amt: amtInput,
						contract: contract,
						selectedAsset,
					});
				}

				setGasLimit(fee.gas);
				setGasPrice(fee.gasPrice);
				setNetworkFee(fee.totalFeeEther);
			} catch (err) {
				console.error("Error fetching network fee:", err);
			}
		};

		const fetchSolFee = async () => {
			const lamportsVal = Math.floor(amtInput * 10 ** 9);
			const sender = new PublicKey(walletAddress);
			const recipient = new PublicKey(addressInput);

			const tx = new Transaction().add(
				SystemProgram.transfer({
					fromPubkey: sender,
					toPubkey: recipient,
					lamports: lamportsVal,
				})
			);

			const { blockhash } = await connection.getLatestBlockhash("finalized");
			(tx.recentBlockhash = blockhash), (tx.feePayer = sender);

			const fee = await calculateSolFee({ connection, transaction: tx });
			console.log(`Fee: ${fee.lamports} lamports (${fee.sol} SOL)`);
			setsolNetworkFee(fee.sol);
		};

		if (selectedAccount?.type === "evm") {
			fetchEVMFee();
			let txNonce;
			(async () => {
				txNonce = await getNonce(web3, walletAddress);
				console.log(txNonce);
				setNonce(txNonce);
			})();
		} else fetchSolFee();
	}, [walletAddress, amtInput, addressInput, selectedOption, chainId]);

	return (
		<div className="relative w-full h-full flex items-center justify-center">
			{loading && <Loader />}
			{showSuccess && (
				<TxSuccessModal
					show={showSuccess}
					onClose={() => setShowSuccess(false)}
				/>
			)}
			<div className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-300 bg-[#f3f5f9] mt-18 w-[60%] m-auto min-h-[85vh] flex flex-col">
				<TxHeader
					onClick={() => navigate("/send")}
					className="bg-[#ffff] h-15"
					title="Review"
				/>

				<div className="w-full h-190 flex flex-col items-center justify-between">
					<div className="w-full h-120 pt-10 px-4 flex flex-col gap-6">
						<h2 className="text-3xl font-bold text-center">
							{amtInput ? amtInput : ""}{" "}
							{selectedAsset?.symbol ? selectedAsset?.symbol : ""}
						</h2>
						<div className="flex flex-col items-center gap-4 mt-6">
							<DataStrip>
								<div className="flex flex-col gap-0.5">
									<p>From</p>
									<div className="bg-[#eceeff] w-40 flex gap-1 items-center justify-center rounded-xl">
										<DeterministicPieIcon address={walletAddress} size={18} />
										<p className="text-blue-700">{accountName}</p>
									</div>
								</div>
								<span className="text-gray-400 ml-20">
									<MdArrowForwardIos size={22} />
								</span>
								<div className="flex flex-col gap-0.5">
									<p>To</p>
									<div className="bg-[#eceeff] min-w-27 gap-1 flex items-center justify-center rounded-xl px-0.5">
										<DeterministicPieIcon address={addressInput} size={18} />
										<Address address={addressInput} className="text-blue-700" />
									</div>
								</div>
							</DataStrip>

							<DataStrip>
								<p>Network</p>
								<div className="bg-zinc-100 rounded px-3 py-1 font-medium">
									{selectedOption?.label}
								</div>
							</DataStrip>

							<DataStrip>
								<p>Network Fee</p>
								<p>
									{selectedAccount?.type === "evm" ? (
										networkFee ? (
											`${networkFee} ${
												selectedOption.chainId === 11155111 ? "ETH" : "Matic"
											}`
										) : (
											<span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-black/30 border-t-black" />
										)
									) : solNetworkFee ? (
										`${solNetworkFee} SOL`
									) : (
										<span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-black/30 border-t-black" />
									)}
								</p>
							</DataStrip>

							{selectedAccount?.type === "evm" && (
								<DataStrip>
									<p>Nonce</p>
									<p>
										{nonce ? (
											nonce
										) : (
											<span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-black/30 border-t-black" />
										)}
									</p>
								</DataStrip>
							)}
						</div>
					</div>

					<div className="w-full py-4 px-4 flex items-center justify-between gap-3 bg-white">
						<TxButtons onClick={handleSend} review={true} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReviewTx;
