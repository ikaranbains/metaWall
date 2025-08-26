import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { useNetwork } from "../context/NetworkContext";
import { isValidWalletAddress } from "../utils/validation";
import toast from "react-hot-toast";
import { useSend } from "../context/TxContext";
import Loader from "./common/Loader";
import TxButtons from "./buttons/TxButtons";
import TxHeader from "./common/TxHeader";
import ToSection from "./ToSection";
import FromSection from "./FromSection";
import SelectTokenModal from "./modals/SelectTokenModal";

const Send = () => {
	const navigate = useNavigate();
	const { walletAddress } = useWallet();
	const {
		addressInput,
		setAddressInput,
		amtInput,
		setAmtInput,
		selectedAsset,
		setSelectedAsset,
	} = useSend();
	const [showStep2, setShowStep2] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const { selectedOption } = useNetwork();
	const [balance, setBalance] = useState("");
	const [loading, setLoading] = useState(false);
	const [showSelectTokenModal, setShowSelectTokenModal] = useState(false);
	const tokensList = JSON.parse(localStorage.getItem("tokensList"));
	const chainId = localStorage.getItem("chainId");
	// const [selectedAsset, setSelectedAsset] = useState(tokensList[chainId][0]);

	const getCachedBalance = () => {
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

	const handleAmtChange = (e) => {
		setAmtInput(e.target.value);
		setDisabled(false);
	};

	const handleAddressChange = (e) => {
		setAddressInput(e.target.value);
		setDisabled(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!amtInput || amtInput === "")
			return toast.error("Amount is required!!");
		const amt = parseFloat(amtInput);
		const blcFloat = parseFloat(balance);
		const blnToken = parseFloat(selectedAsset?.formattedBalance || 0);
		if (selectedAsset?.name === "POL" || selectedAsset?.name === "ETH") {
			if (blcFloat <= amt) return toast.error("Insufficient Funds!!");
		} else {
			if (blnToken < amt) return toast.error("Insufficient Funds!!");
		}
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			navigate("/review");
		}, 1500);
	};

	useEffect(() => {
		getCachedBalance();
	}, []);

	return (
		<div className="w-full h-full flex items-center justify-center">
			{loading && <Loader />}
			{showSelectTokenModal && (
				<SelectTokenModal
					isOpen={showSelectTokenModal}
					onClose={() => setShowSelectTokenModal(false)}
					selectedOption={selectedOption}
					tokensList={tokensList}
					chainId={chainId}
					balance={balance}
					setSelectedAsset={setSelectedAsset}
					selectedAsset={selectedAsset}
				/>
			)}
			<div className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-300 bg-white mt-13 w-[65%] m-auto min-h-[87vh] flex flex-col">
				<TxHeader
					onClick={() => navigate("/home")}
					className="mt-3 justify-between"
					title="Send"
				/>

				<div className="mt-10 h-190 flex flex-col justify-between pb-10 px-5">
					<div className="flex flex-col gap-10">
						<FromSection
							walletAddress={walletAddress}
							selectedOption={selectedOption}
							showStep2={showStep2}
							amtInput={amtInput}
							handleAmtChange={handleAmtChange}
							balance={balance}
							onSubmit={(e) => handleSubmit(e)}
							formId="toForm"
							setShowSelectTokenModal={setShowSelectTokenModal}
							selectedAsset={selectedAsset}
						/>

						<ToSection
							addressInput={addressInput}
							showStep2={showStep2}
							handleAddressChange={handleAddressChange}
							onSubmit={(e) => handleNext(e)}
							onClear={() => setShowStep2(false)}
							formId="addressForm"
						/>
					</div>
					<div className="flex items-center justify-between gap-3">
						<TxButtons
							showStep2={showStep2}
							form1="addressForm"
							form2="toForm"
							type="submit"
							disabled={disabled}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Send;
