export const chainConfigs = [
	{
		value: "sepolia",
		label: "Sepolia",
		name: "Sepolia",
		chainId: 11155111,
		network: "sepolia",
		rpc: "https://eth-sepolia.g.alchemy.com/v2/kjHIh07O7c7Od-1LLJ9Pv",
		wss: "wss://eth-sepolia.g.alchemy.com/v2/kjHIh07O7c7Od-1LLJ9Pv",
		blockExplorerUrls: ["https://sepolia.etherscan.io"],
		nativeCurrency: {
			name: "ETH",
			symbol: "SepoliaETH",
			decimals: 18,
		},
	},
	{
		value: "polygon",
		label: "Polygon Amoy",
		name: "Polygon",
		chainId: 80002,
		network: "polygon",
		rpc: "https://polygon-amoy.g.alchemy.com/v2/kjHIh07O7c7Od-1LLJ9Pv",
		wss: "wss://polygon-amoy.g.alchemy.com/v2/kjHIh07O7c7Od-1LLJ9Pv",
		blockExplorerUrls: ["https://oklink.com/amoy"],
		nativeCurrency: {
			name: "MATIC",
			symbol: "MATIC",
			decimals: 18,
		},
	},
];
