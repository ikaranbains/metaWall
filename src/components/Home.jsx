import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNetwork } from "../context/NetworkContext";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import ERC20ABI from "../ABI/TOKEN_ABI.json";
import { getCryptoPrices } from "../utils/utilityFn";
import ReceiveModal from "./modals/ReceiveModal";
import ImportTokensModal from "./modals/ImportTokensModal";
import NetworkSelector from "./NetworkSelector";
import Accounts from "./Accounts";
import Menu from "./Menu";
import HomeButton from "./buttons/HomeButton";
import { GoArrowUpRight } from "react-icons/go";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import ActivityBar from "./ActivityBar";
import ManageAccountsModal from "./modals/ManageAccountsModal";
import { useAccounts } from "../context/AccountsContext";
import { useAddEthAccount } from "../hooks/useAddEthAccount";

const Home = () => {
	const navigate = useNavigate();
	const { selectedAccount, setSelectedAccount } = useAccounts();
	const walletAddress = selectedAccount?.address;
	const accountName = selectedAccount?.name;
	const { selectedOption, setSelectedOption, balance } = useNetwork();
	const [showReceiveModal, setShowReceiveModal] = useState(false);
	const [showImportModal, setShowImportModal] = useState(false);
	const [showManageAccountModal, setShowManageAccountModal] = useState(false);
	const [tokenAddress, setTokenAddress] = useState("");
	const [disabled, setDisabled] = useState(true);
	const [showTokenDetails, setShowTokenDetails] = useState(false);
	const [step2, setStep2] = useState(false);
	const [accStep2, setAccStep2] = useState(false);
	const [accStep3, setAccStep3] = useState(false);
	const [newAccNameInpETH, setNewAccNameInpETH] = useState("");
	const [newAccNameInpSOL, setNewAccNameInpSOL] = useState("");
	const [isEthereum, setIsEthereum] = useState(false);
	const [tokensList, setTokensList] = useState({
		11155111: [],
		80002: [],
		97: [],
	});
	const web3 = new Web3(selectedOption?.rpc);
	const chainId = selectedOption?.chainId;
	let key = `cachedBalance_${chainId}_${walletAddress}`;
	const key2 = `${chainId}_${walletAddress}`;
	const cachedBalance = localStorage.getItem(key);
	const [refreshing, setRefreshing] = useState(false);

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
			formattedBalance: format.toFixed(6),
			price,
			message,
		};
	};

	const handleImportToken = () => {
		localStorage.setItem(`tokensList`, JSON.stringify(tokensList));

		toast.success("Token imported!!");
		setShowImportModal(false);
		setDisabled(true);
		setShowTokenDetails(false);
		setStep2(false);
		setTokenAddress("");
		// setIsImported(true);
	};

	const refreshTokensList = async () => {
		if (!walletAddress || !chainId) return;
		setRefreshing(true); // start loader

		try {
			const updatedTokens = await Promise.all(
				tokensList[chainId].map(async (token) => {
					if (token.tokenType === "native") {
						const nativeBalance = await web3.eth.getBalance(walletAddress);
						const formatted = Number(nativeBalance) / 10 ** token.decimals;
						const { price, message } = await getCryptoPrices(token.symbol);

						return {
							...token,
							formattedBalance: formatted,
							price: price ? `$ ${Number(price)}` : message,
						};
					} else {
						const contract = new web3.eth.Contract(ERC20ABI, token.address);
						const balance = await contract.methods
							.balanceOf(walletAddress)
							.call();
						const formatted = Number(balance) / 10 ** token.decimals;
						const { price, message } = await getCryptoPrices(token.symbol);

						return {
							...token,
							formattedBalance: formatted,
							price: price ? `$ ${Number(price)}` : message,
						};
					}
				})
			);

			const updatedList = { ...tokensList, [chainId]: updatedTokens };
			setTokensList(updatedList);
			localStorage.setItem("tokensList", JSON.stringify(updatedList));
			toast.success("Token list refreshed!");
		} catch (err) {
			console.error(err);
			toast.error("Failed to refresh token list");
		} finally {
			setRefreshing(false); // stop loader
		}
	};

	const handleNewAccNameChangeETH = (e) => {
		setNewAccNameInpETH(e.target.value);
	};
	const handleNewAccNameChangeSOL = (e) => {
		setNewAccNameInpSOL(e.target.value);
	};

	const { mutate: addEthAccount } = useAddEthAccount(web3);

	const handleAddNewAccETH = () => {
		addEthAccount(newAccNameInpETH, {
			onSuccess: () => {
				setNewAccNameInpETH("");
				toast.success("New Account Created Successfully!!");
				setAccStep2(false);
				setAccStep3(false);
			},
		});
	};

	const handleAddNewAccSOL = () => {
		alert("new sol acc created!!");
		console.log(newAccNameInpSOL);
		setNewAccNameInpSOL("");
	};

	// note: add native currency in tokens list
	useEffect(() => {
		const chain = selectedOption?.chainId;
		if (!chain) return;

		const handleNativePrice = async () => {
			const { price, message } = await getCryptoPrices(
				selectedOption?.nativeCurrency?.symbol
			);

			setTokensList((prev) => {
				const currentList = prev[key2] || [];
				// if (prev[chain].length > 0) return prev;
				if (currentList.some((t) => t.tokenType === "native")) return prev;

				const nativeToken = {
					name: selectedOption?.nativeCurrency?.name,
					symbol: selectedOption?.nativeCurrency?.symbol,
					decimals: selectedOption?.nativeCurrency?.decimals,
					formattedBalance: cachedBalance ? cachedBalance : 0,
					price: price ? `$ ${Number(price)}` : message,
					address: null,
					tokenType: "native",
				};

				const updated = {
					...prev,
					[key2]: [nativeToken, ...currentList],
				};

				localStorage.setItem("tokensList", JSON.stringify(updated));
				return updated;
			});
		};

		handleNativePrice();
	}, [selectedOption, balance, walletAddress]);

	useEffect(() => {
		const fetchTokenDetails = async () => {
			// const chain = selectedOption?.chainId;

			if (!tokenAddress) {
				setDisabled(true);
				setShowTokenDetails(false);
				return;
			}

			if (tokenAddress.length === 42) {
				const res = await getTokenDetails();

				if (!res) {
					setShowTokenDetails(false);
					setDisabled(true);
					return toast.error("Invalid token address");
				}

				const newToken = {
					...res,
					address: tokenAddress,
					decimals: Number(res.decimals),
					formattedBalance: Number(res.formattedBalance),
					price: res.price ? Number(res.price) : null,
					tokenType: "custom",
				};
				// console.log("duplicate token found ---------------------");
				// update existing token details
				setTokensList((prev) => {
					const current = prev[key] || [];

					const existing = current.find(
						(item) => item.address === tokenAddress
					);

					let updatedList;

					if (existingToken) {
						console.log("duplicate token found ---------------------");
						updatedList = current.map((item) =>
							item.address === tokenAddress
								? {
										...item,
										formattedBalance: Number(res.formattedBalance),
										price: res.price ? Number(res.price) : null,
								  }
								: item
						);
					} else {
						updatedList = [...current, newToken];
					}

					const updated = { ...prev, [key2]: updatedList };

					console.log("updated------------------", updated);
					localStorage.setItem("tokensList", JSON.stringify(updated));
					return updated;
				});
				setShowTokenDetails(true);
				setDisabled(false);
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
			{showManageAccountModal && (
				<ManageAccountsModal
					isOpen={showManageAccountModal}
					onClose={() => {
						setShowManageAccountModal(false);
						setAccStep2(false);
						setAccStep3(false);
					}}
					walletAddress={walletAddress}
					accountName={accountName}
					accStep2={accStep2}
					setAccStep2={setAccStep2}
					accStep3={accStep3}
					setAccStep3={setAccStep3}
					newAccNameInpETH={newAccNameInpETH}
					newAccNameInpSOL={newAccNameInpSOL}
					handleNewAccNameChangeETH={handleNewAccNameChangeETH}
					handleNewAccNameChangeSOL={handleNewAccNameChangeSOL}
					handleAddNewAccETH={handleAddNewAccETH}
					handleAddNewAccSOL={handleAddNewAccSOL}
					isEthereum={isEthereum}
					setIsEthereum={setIsEthereum}
					selectedAccount={selectedAccount}
					setSelectedAccount={setSelectedAccount}
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
						<Accounts
							address={walletAddress}
							setShowManageAccountModal={setShowManageAccountModal}
							accountName={accountName}
						/>
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
						selectedOption={selectedOption}
						cachedBalance={cachedBalance}
						refreshTokensList={refreshTokensList}
						refreshing={refreshing}
					/>
				</div>
			</div>
		</div>
	);
};

export default Home;
