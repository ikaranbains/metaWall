import { createContext, useContext, useEffect, useState } from "react";
import useUser from "../hooks/useUser";

export const AccountsDataContext = createContext();
export const AccountsContext = ({ children }) => {
	const { userData } = useUser();
	const [accountsList, setAccountsList] = useState([]);
	// console.log(accountsList);
	const [selectedAccount, setSelectedAccount] = useState(() => {
		try {
			const stored = localStorage.getItem("selectedAccount");
			return stored ? JSON.parse(stored) : null;
		} catch {
			return null;
		}
	});

	useEffect(() => {
		const selected = JSON.parse(localStorage.getItem("selectedAccount"));
		if (selected) setSelectedAccount(selected);
	}, []);

	useEffect(() => {
		if (userData?.userWallet) {
			setAccountsList(userData.userWallet);
		}
	}, [userData]);

	return (
		<AccountsDataContext.Provider
			value={{
				accountsList,
				setAccountsList,
				selectedAccount,
				setSelectedAccount,
			}}
		>
			{children}
		</AccountsDataContext.Provider>
	);
};

export const useAccounts = () => useContext(AccountsDataContext);
