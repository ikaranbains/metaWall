import React, { createContext, useContext, useState } from "react";
import { chainConfigs } from "../utils/constants";

export const NetworkDataContext = createContext();

export const NetworkContext = ({ children }) => {
	const [selectedOption, setSelectedOption] = useState(chainConfigs[0]);
	return (
		<NetworkDataContext.Provider value={{ selectedOption, setSelectedOption }}>
			{children}
		</NetworkDataContext.Provider>
	);
};

export const useNetwork = () => useContext(NetworkDataContext);
