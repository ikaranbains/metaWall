export const chainConfigs = [
	{
		value: "sepolia",
		label: "Sepolia",
		name: "Sepolia",
		chainId: 11155111,
		network: "sepolia",
		rpc: "https://ethereum-sepolia-rpc.publicnode.com",
		wss: "wss://ethereum-sepolia-rpc.publicnode.com",
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
		rpc: "https://polygon-amoy-bor-rpc.publicnode.com",
		wss: "wss://polygon-amoy-bor-rpc.publicnode.com",
		blockExplorerUrls: ["https://oklink.com/amoy"],
		nativeCurrency: {
			name: "MATIC",
			symbol: "MATIC",
			decimals: 18,
		},
	},
];
