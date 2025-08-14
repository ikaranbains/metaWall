import React, { createContext, useState } from "react";

export const WalletDataContext = createContext();

const WalletContext = ({ children }) => {
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

export const useWallet = () => useContext(WalletContext);
