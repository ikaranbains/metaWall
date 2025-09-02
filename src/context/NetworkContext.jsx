import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { evmConfigs, solConfigs } from "../utils/constants";
import Web3 from "web3";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useAccounts } from "./AccountsContext";
import { getKeys } from "../utils/utilityFn";

export const NetworkDataContext = createContext();

export const NetworkContext = ({ children }) => {
	const [selectedOption, setSelectedOption] = useState(() => {
		const chainId = localStorage.getItem("chainId");
		if (chainId && chainId !== null) {
			const chain = evmConfigs.find((item) => item.chainId === Number(chainId));
			if (chain) return chain;
			return evmConfigs[0];
		}
		return solConfigs[0];
	});

	const chainId = selectedOption?.chainId || null;
	const [balance, setBalance] = useState("0");
	const [web3Provider, setWeb3Provider] = useState(null);
	const { selectedAccount } = useAccounts();
	const walletAddress = selectedAccount?.address;
	const walletType = selectedAccount?.type;
	// console.log("wallet address in net context-----------------", walletAddress)

	const { balanceKey } = getKeys(chainId, walletAddress);

	// note: restore chain on reload
	// restore chain on account change
	useEffect(() => {
		if (!selectedAccount) return;

		if (selectedAccount.type === "sol") {
			setSelectedOption(solConfigs[0]); // ✅ always sol config!
			localStorage.setItem("chainId", "null");
			const cached = localStorage.getItem(
				`cachedBalance_sol_${selectedAccount.address}`
			);
			if (cached) setBalance(cached);
		} else if (selectedAccount.type === "evm") {
			const chainId = localStorage.getItem("chainId");
			const chain = evmConfigs.find((item) => item.chainId === Number(chainId));
			if (chain) {
				setSelectedOption(chain);
				const cached = localStorage.getItem(
					`cachedBalance_evm_${chain.chainId}_${selectedAccount.address}`
				);
				if (cached) setBalance(cached);
			} else {
				setSelectedOption(evmConfigs[0]); // fallback if chain not found
			}
		}
	}, [selectedAccount]);

	// note: set web3Provider whenever chain changes
	useEffect(() => {
		if (!selectedOption) return;
		if (selectedOption?.chainId) {
			const provider = new Web3(selectedOption?.rpc);
			setWeb3Provider(provider);
			console.log("✅ Provider set for", selectedOption?.label);
		} else {
			setWeb3Provider(null);
			console.log("🌞 Solana provider set:", selectedOption?.label);
		}
	}, [selectedOption]);

	// note: single official getBalance fn (for manual refresh)
	const getBalance = useCallback(async () => {
		if (!walletAddress || !selectedOption) return;

		try {
			if (web3Provider && selectedOption.chainId) {
				const balanceWei = await web3Provider.eth.getBalance(walletAddress);
				const balanceEth = web3Provider.utils.fromWei(balanceWei, "ether");
				const formatted = parseFloat(balanceEth).toLocaleString(undefined, {
					minimumFractionDigits: 0,
					maximumFractionDigits: 6,
				});

				setBalance(formatted);
				if (balanceKey) localStorage.setItem(balanceKey, formatted);

				console.log(
					`✅ Balance fetched for ${selectedOption.label} = ${formatted}`
				);
			} else if (!selectedOption.chainId && walletType === "sol") {
				const net = selectedOption?.network || "testnet";
				const connection = new Connection(
					selectedOption?.rpc || clusterApiUrl(net)
				);
				const lamports = await connection.getBalance(
					new PublicKey(walletAddress)
				);

				const solBalance = (lamports / 10 ** 9).toLocaleString(undefined, {
					minimumFractionDigits: 0,
					maximumFractionDigits: 6,
				});
				setBalance(solBalance);
				if (balanceKey) localStorage.setItem(balanceKey, solBalance);
				console.log(`✅ [SOL] Balance ${selectedOption.label} = ${solBalance}`);
			}
		} catch (err) {
			console.error("❌ error balance", err);
		}
	}, [walletAddress, selectedOption, web3Provider, balanceKey]);

	// note: auto-load when chain/provider/wallet changes
	useEffect(() => {
		if (!walletAddress || !selectedOption) return;
		getBalance();
	}, [walletAddress, selectedOption, web3Provider]);

	// console.log(selectedOption);

	return (
		<NetworkDataContext.Provider
			value={{
				selectedOption,
				setSelectedOption,
				balance,
				setBalance,
				getBalance, // manual refresh is available
				web3Provider,
			}}
		>
			{children}
		</NetworkDataContext.Provider>
	);
};

export const useNetwork = () => useContext(NetworkDataContext);
