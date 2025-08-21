import React, { createContext, useContext, useEffect, useState } from "react";
import useUser from "../hooks/useUser";

const TxDataContext = createContext();

export const TxContext = ({ children }) => {
	const [addressInput, setAddressInput] = useState("");
	const [amtInput, setAmtInput] = useState("");
	const { userData } = useUser();
	const [privateKey, setPrivateKey] = useState(null);

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
			}}
		>
			{children}
		</TxDataContext.Provider>
	);
};

export const useSend = () => useContext(TxDataContext);
