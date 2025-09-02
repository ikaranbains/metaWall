import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import { useNetwork } from "./NetworkContext";
import { useAccounts } from "./AccountsContext";
import { getKeys } from "../utils/utilityFn";

const TxDataContext = createContext();

export const TxContext = ({ children }) => {
	const { selectedOption } = useNetwork();
	const { selectedAccount } = useAccounts();
	const [addressInput, setAddressInput] = useState("");
	const [amtInput, setAmtInput] = useState("");
	const { data: userData } = useUser();
	const [privateKey, setPrivateKey] = useState(null);
	const [secretKey, setSecretKey] = useState(null);

	const [selectedAsset, setSelectedAsset] = useState(null);

	// note: setting private key from indexDB data
	useEffect(() => {
		if (!userData || !selectedAccount) return;
		const account = userData?.userWallet?.find(
			(acc) => acc.account === selectedAccount?.address
		);

		if (account) {
			if (account?.type === "evm") setPrivateKey(account?.privateKey);
			if (account?.type === "sol") setSecretKey(account?.secretKey);
		}
	}, [userData]);

	// note: setting to address from local storage
	useEffect(() => {
		const toAddress = localStorage.getItem("toAddress");
		if (toAddress) setAddressInput(toAddress);
	}, []);

	// note: setting selected asset
	useEffect(() => {
		if (!selectedAccount) return;

		const tokensList = JSON.parse(localStorage.getItem("tokensList")) || {};
		const { tokenKey } = getKeys(
			selectedOption?.chainId || null,
			selectedAccount?.address
		);

		if (tokensList[tokenKey] && tokensList[tokenKey].length > 0) {
			setSelectedAsset(tokensList[tokenKey][0]); // native first
		} else {
			setSelectedAsset(null);
		}
	}, [selectedAccount, selectedOption]);

	return (
		<TxDataContext.Provider
			value={{
				addressInput,
				setAddressInput,
				amtInput,
				setAmtInput,
				privateKey,
				selectedAsset,
				setSelectedAsset,
				secretKey,
				setSecretKey,
			}}
		>
			{children}
		</TxDataContext.Provider>
	);
};

export const useSend = () => useContext(TxDataContext);
