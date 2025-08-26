import React, { createContext, useContext, useEffect, useState } from "react";
import useUser from "../hooks/useUser";

const TxDataContext = createContext();

export const TxContext = ({ children }) => {
	const [addressInput, setAddressInput] = useState("");
	const [amtInput, setAmtInput] = useState("");
	const { userData } = useUser();
	const [privateKey, setPrivateKey] = useState(null);
	const tokensList = JSON.parse(localStorage.getItem("tokensList"));
	const chainId = localStorage.getItem("chainId");
	const [selectedAsset, setSelectedAsset] = useState(
		tokensList
			? tokensList[chainId][0]
			: {
					name: "POL",
					symbol: "POL",
					decimals: 18,
					formattedBalance: "0.097703",
					price: "$ 0.2358",
					address: null,
					tokenType: "native",
			  }
	);

	useEffect(() => {
		if (userData) {
			setPrivateKey(userData?.userWallet[0]?.privateKey);
		}
	}, [userData]);

	useEffect(() => {
		const toAddress = localStorage.getItem("toAddress");
		if (toAddress) setAddressInput(toAddress);
	}, []);

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
