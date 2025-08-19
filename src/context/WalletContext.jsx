import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const WalletDataContext = createContext();

export const WalletContext = ({ children }) => {
	const [wallet, setWallet] = useState({});
	const [walletAddress, setWalletAddress] = useState("");

	useEffect(() => {
		const address =
			localStorage.getItem("walletAddress") || Cookies.get("walletAddress");
		setWalletAddress(address);
	}, [wallet]);
	return (
		<WalletDataContext.Provider
			value={{ wallet, setWallet, walletAddress, setWalletAddress }}
		>
			{children}
		</WalletDataContext.Provider>
	);
};

export const useWallet = () => useContext(WalletDataContext);
