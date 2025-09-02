import { apiCall } from "./apiService";

export function stringToNumberSeed(str) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}

export function getCoordinatesForPercent(percent) {
	const x = 50 + 50 * Math.cos(2 * Math.PI * percent - Math.PI / 2);
	const y = 50 + 50 * Math.sin(2 * Math.PI * percent - Math.PI / 2);
	return [x, y];
}

export async function getCryptoPrices(symbol) {
	try {
		const res = await apiCall({
			method: "get",
			url: `${import.meta.env.VITE_CC_API}/price`,
			params: {
				fsym: symbol,
				tsyms: "USD",
				api_key: import.meta.env.VITE_CC_API_KEY,
			},
			headers: {
				"X-CMC_PRO_API_KEY": import.meta.env.VITE_CMC_API_KEY,
			},
		});

		if (res.success && res.data.USD) {
			// console.log("response in fn ---------------", res);
			return { success: true, price: res.data.USD, message: "Price fetched" };
		} else {
			return {
				success: false,
				message: "No conversion rate available",
				price: null,
			};
		}
	} catch (error) {
		console.error("CryptoCompare fetch error:", err);
		return { success: false, message: "Something went wrong", price: null };
	}
}

export const formatTokenAmount = (value, decimals, symbol) => {
	// Convert 'value' string to number with decimals
	const amount = Number(value) / 10 ** Number(decimals);

	// Formatter: max 6 decimals, no scientific notation
	const formatter = new Intl.NumberFormat("en-US", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 6,
	});

	return `${formatter.format(amount)} ${symbol}`;
};

export const formatNativeAmount = (value, symbol) => {
	if (!value) return `0 ${symbol}`;

	// Convert from Wei to ETH/POL/etc
	const num = Number(value) / 1e18;

	// Format with max 6 decimals, no scientific notation
	const formatter = new Intl.NumberFormat("en-US", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 6,
		notation: "standard", // 👈 no scientific notation
	});

	return `${formatter.format(num)} ${symbol}`;
};

export function getKeys(chainId, address) {
	return {
		balanceKey: chainId
			? `cachedBalance_evm_${chainId}_${address}`
			: `cachedBalance_sol_${address}`,
		tokenKey: chainId
			? `evm_${chainId}_${address}`
			: `sol_${address}`,
	};
}
