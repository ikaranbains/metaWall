import React, { createContext, useContext, useState } from "react";

const WalletDataContext = createContext();

export const WalletContext = ({ children }) => {
	const [wallet, setWallet] = useState({});
	const [walletAddress, setWalletAddress] = useState("");
	return (
		<div>
			<WalletDataContext.Provider
				value={{ wallet, setWallet, walletAddress, setWalletAddress }}
			>
				{children}
			</WalletDataContext.Provider>
		</div>
	);
};

export const useWallet = () => useContext(WalletDataContext);