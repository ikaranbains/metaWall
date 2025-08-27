import { createContext, useContext, useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import { useNetwork } from "./NetworkContext";

const TxDataContext = createContext();

export const TxContext = ({ children }) => {
	const { selectedOption } = useNetwork();
	const [addressInput, setAddressInput] = useState("");
	const [amtInput, setAmtInput] = useState("");
	const { userData } = useUser();
	const [privateKey, setPrivateKey] = useState(null);
	const [tokensList] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem("tokensList")) || {};
		} catch {
			return {};
		}
	});

	const [chainId, setChainId] = useState(localStorage.getItem("chainId"));
	// console.log("tx context --------- chain ----------", chainId);
	const [selectedAsset, setSelectedAsset] = useState(
		tokensList[chainId][0] || {}
	);
	// console.log("the selected -------------------", selectedAsset);

	// note: setting private key from indexDB data
	useEffect(() => {
		if (userData) {
			setPrivateKey(userData?.userWallet[0]?.privateKey);
		}
	}, [userData]);

	// note: setting to address from local storage
	useEffect(() => {
		const toAddress = localStorage.getItem("toAddress");
		if (toAddress) setAddressInput(toAddress);
	}, []);

	// note: setting selected asset
	useEffect(() => {
		if (tokensList && chainId && tokensList[chainId]?.length > 0) {
			const firstAsset = tokensList[chainId][0];
			setSelectedAsset(firstAsset);
		} else {
			setSelectedAsset(tokensList[0][0]);
		}
	}, [tokensList, chainId, selectedOption]);

	// note: setting chainId from local storage
	useEffect(() => {
		const id = localStorage.getItem("chainId");
		setChainId(id);
	}, [selectedOption]);

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
			}}
		>
			{children}
		</TxDataContext.Provider>
	);
};

export const useSend = () => useContext(TxDataContext);
