import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { chainConfigs } from "../utils/constants";
import Web3 from "web3";

export const NetworkDataContext = createContext();

export const NetworkContext = ({ children }) => {
	const [selectedOption, setSelectedOption] = useState(chainConfigs[0]);
	const [balance, setBalance] = useState("0");
	const [web3Provider, setWeb3Provider] = useState(null);
	const walletAddress = localStorage.getItem("walletAddress");

	// restore chain on reload
	useEffect(() => {
		const chainId = localStorage.getItem("chainId");
		if (!chainId) return;
		const chain = chainConfigs.find((item) => item.chainId === Number(chainId));
		if (chain) {
			setSelectedOption(chain);
			const key = `cachedBalance_${chain.chainId}_${walletAddress}`;
			const cached = localStorage.getItem(key);
			if (cached) setBalance(cached);
		}
	}, [walletAddress]);

	// set web3Provider whenever chain changes
	useEffect(() => {
		if (selectedOption?.rpc) {
			const provider = new Web3(selectedOption.rpc);
			setWeb3Provider(provider);
			console.log("✅ Provider set for", selectedOption.label);
		}
	}, [selectedOption]);

	// single official getBalance fn (for manual refresh)
	const getBalance = useCallback(async () => {
		if (!walletAddress || !selectedOption?.chainId || !web3Provider) return;
		const currentChainId = selectedOption.chainId;

		try {
			const balanceWei = await web3Provider.eth.getBalance(walletAddress);
			const balanceEth = web3Provider.utils.fromWei(balanceWei, "ether");
			const formatted = parseFloat(balanceEth).toLocaleString(undefined, {
				minimumFractionDigits: 0,
				maximumFractionDigits: 6,
			});

			if (currentChainId === selectedOption.chainId) {
				setBalance(formatted);
				localStorage.setItem(
					`cachedBalance_${currentChainId}_${walletAddress}`,
					formatted
				);
				console.log(
					`✅ Balance fetched for ${selectedOption.label} = ${formatted}`
				);
			} else {
				console.log("⚠️ Ignored stale fetch for", selectedOption.label);
			}
		} catch (err) {
			console.error("❌ error balance", err);
		}
	}, [walletAddress, selectedOption, web3Provider]);

	// auto-load when chain/provider/wallet changes
	useEffect(() => {
		if (!walletAddress || !selectedOption?.chainId || !web3Provider) return;
		let stale = false;

		// load cached first
		const key = `cachedBalance_${selectedOption.chainId}_${walletAddress}`;
		const cached = localStorage.getItem(key);
		if (cached) {
			setBalance(cached);
		
		}
	
		(async () => {
			try {
				const balanceWei = await web3Provider.eth.getBalance(walletAddress);
				const balanceEth = web3Provider.utils.fromWei(balanceWei, "ether");
				const formatted = parseFloat(balanceEth).toLocaleString(undefined, {
					minimumFractionDigits: 0,
					maximumFractionDigits: 6,
				});

				if (!stale) {
					setBalance(formatted);
					localStorage.setItem(
						`cachedBalance_${selectedOption.chainId}_${walletAddress}`,
						formatted
					);
					console.log(
						`✅ Balance fetched for ${selectedOption.label} = ${formatted}`
					);
				}
			} catch (err) {
				console.error("❌ error balance", err);
			}
		})();

		return () => {
			stale = true;
		};
	}, [walletAddress, selectedOption, web3Provider]);

	return (
		<NetworkDataContext.Provider
			value={{
				selectedOption,
				setSelectedOption,
				balance,
				getBalance, // manual refresh is available
				web3Provider,
			}}
		>
			{children}
		</NetworkDataContext.Provider>
	);
};

export const useNetwork = () => useContext(NetworkDataContext);
