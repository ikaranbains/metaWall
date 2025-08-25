import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import NetworkSelector from "./NetworkSelector";
import { GoArrowUpRight } from "react-icons/go";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import Menu from "./Menu";
import Accounts from "./Accounts";
import { useNetwork } from "../context/NetworkContext";
import ActivityBar from "./ActivityBar";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import ReceiveModal from "./modals/ReceiveModal";
import HomeButton from "./buttons/HomeButton";
import ImportTokensModal from "./modals/ImportTokensModal";
import Web3 from "web3";
import ERC20ABI from "../ABI/TOKEN_ABI.json";
import { getCryptoPrices } from "../utils/utilityFn";

const Home = () => {
	const navigate = useNavigate();
	const { walletAddress } = useWallet();
	const { selectedOption, setSelectedOption, balance } = useNetwork();
	const [showReceiveModal, setShowReceiveModal] = useState(false);
	const [showImportModal, setShowImportModal] = useState(false);
	const [tokenAddress, setTokenAddress] = useState("");
	const [disabled, setDisabled] = useState(true);
	const [showTokenDetails, setShowTokenDetails] = useState(false);
	const [step2, setStep2] = useState(false);
	const [isImported, setIsImported] = useState(false);
	const [tokensList, setTokensList] = useState({
		11155111: [],
		80002: [],
	});
	const web3 = new Web3(selectedOption?.rpc);
	const chainId = selectedOption?.chainId;

	const handleChange = async (option) => {
		setSelectedOption(option);
		toast.success("Chain changed to " + option?.label);
		localStorage.setItem("chainId", option?.chainId);
	};

	const handleTokenAddressChange = (e) => {
		setTokenAddress(e.target.value);
		setDisabled(false);
	};

	const getTokenDetails = async () => {
		if (!web3 || !tokenAddress || !walletAddress) return;
		const tokenContract = new web3.eth.Contract(ERC20ABI, tokenAddress);

		const [name, symbol, decimals, balance] = await Promise.all([
			tokenContract.methods.name().call(),
			tokenContract.methods.symbol().call(),
			tokenContract.methods.decimals().call(),
			tokenContract.methods.balanceOf(walletAddress).call(),
		]);

		const format = Number(balance) / 10 ** Number(decimals);

		const { price, message } = await getCryptoPrices(symbol);

		return {
			name,
			symbol,
			decimals,
			formattedBalance: format,
			price,
			message,
		};
	};

	const handleImportToken = () => {
		localStorage.setItem(`tokensList`, JSON.stringify(tokensList));

		toast.success("Token imported!!");
		setShowImportModal(false);
		setTokenAddress("");
		setDisabled(true);
		setShowTokenDetails(false);
		setStep2(false);
		setIsImported(true);
	};

	useEffect(() => {
		const fetchTokenDetails = async () => {
			const chain = selectedOption?.chainId;

			if (!tokenAddress) {
				setDisabled(true);
				setShowTokenDetails(false);
				return;
			}

			if (tokenAddress.length === 42) {
				const res = await getTokenDetails();

				if (res) {
					const token = {
						...res,
						address: tokenAddress,
						decimals: Number(res.decimals),
						formattedBalance: Number(res.formattedBalance),
						price: res.price ? Number(res.price) : null,
					};

					setTokensList((prev) => {
						const updated = {
							...prev,
							[chain]: [...prev[chain], token],
						};

						localStorage.setItem("tokensList", JSON.stringify(updated));

						return updated;
					});
					setShowTokenDetails(true);
					setDisabled(false);
				} else {
					setShowTokenDetails(false);
					setDisabled(true);
				}
			}
		};

		fetchTokenDetails();
	}, [tokenAddress]);

	useEffect(() => {
		const stored = localStorage.getItem("tokensList");
		if (stored) {
			setTokensList(JSON.parse(stored));
		}
	}, []);

	console.log(tokensList);

	return (
		<div className="min-h-screen relative overflow-x-hidden">
			{showReceiveModal && (
				<ReceiveModal
					walletAddress={walletAddress}
					isOpen={showReceiveModal}
					onClose={() => setShowReceiveModal(false)}
				/>
			)}
			{showImportModal && (
				<ImportTokensModal
					isOpen={showImportModal}
					onClose={() => setShowImportModal(false)}
					selectedOption={selectedOption}
					tokenAddress={tokenAddress}
					onChange={(e) => handleTokenAddressChange(e)}
					disabled={disabled}
					showTokenDetails={showTokenDetails}
					setShowTokenDetails={setShowTokenDetails}
					tokensList={tokensList}
					setStep2={setStep2}
					step2={step2}
					handleImportToken={handleImportToken}
				/>
			)}
			<div className="w-full h-full bg-[#f3f5f9] absolute"></div>
			<div className="absolute w-full z-[99]">
				<h2 className="font-bold text-xl text-center mt-10 leading-none">
					meta
				</h2>
				<h2 className="font-bold text-3xl text-center leading-none">Wall</h2>
				<div className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-300 bg-white mt-6 w-[65%] m-auto h-[85vh] flex items-center flex-col">
					<div className="w-full h-20 flex items-center py-2 justify-between px-10 border-b border-zinc-200">
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
							<HomeButton
								onClick={() => navigate("/send")}
								icon={<GoArrowUpRight />}
								title="Send"
							/>

							<HomeButton
								onClick={() => setShowReceiveModal(true)}
								icon={<MdOutlineQrCodeScanner />}
								title="Receive"
							/>
						</div>
					</div>
					<ActivityBar
						setShowImportModal={setShowImportModal}
						isImported={isImported}
						selectedOption={selectedOption}
					/>
				</div>
			</div>
		</div>
	);
};

export default Home;
