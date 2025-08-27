import { useCallback, useEffect, useState } from "react";
import { apiCall } from "../utils/apiService";
import { useAccounts } from "../context/AccountsContext";

const VITE_ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;

export const useTxList = (chainId, pageSize = 20) => {
	const [transactions, setTransactions] = useState([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const { selectedAccount } = useAccounts();
	const walletAddress = selectedAccount?.address;
	const [hasInitialFetch, setHasInitialFetch] = useState(false);

	const fetchTxs = useCallback(async () => {
		const chainId = localStorage.getItem("chainId");
		if (!walletAddress || loading || !hasMore || !chainId) return;

		setLoading(true);

		try {
			// 1. Fetch normal ETH/native transactions
			const nativeRes = await apiCall({
				method: "get",
				url: "/api",
				params: {
					chainId,
					module: "account",
					action: "txlist",
					address: walletAddress,
					startblock: 0,
					endblock: 99999999,
					page,
					offset: pageSize,
					sort: "desc",
					apikey: VITE_ETHERSCAN_API_KEY,
				},
			});

			// 2. Fetch ERC20 token transfers
			const tokenRes = await apiCall({
				method: "get",
				url: "/api",
				params: {
					chainId,
					module: "account",
					action: "tokentx",
					address: walletAddress,
					startblock: 0,
					endblock: 99999999,
					page,
					offset: pageSize,
					sort: "desc",
					apikey: VITE_ETHERSCAN_API_KEY,
				},
			});

			// 3. Normalize & merge results
			const nativeTxs =
				nativeRes?.success && nativeRes?.data?.status === "1"
					? nativeRes.data.result
					: [];

			const tokenTxs =
				tokenRes?.success && tokenRes?.data?.status === "1"
					? tokenRes.data.result
					: [];

			// Add a field `type` so UI can know what it is
			nativeTxs.forEach((tx) => (tx.type = "native"));
			tokenTxs.forEach((tx) => (tx.type = "token"));

			const allTxs = [...nativeTxs, ...tokenTxs].sort(
				(a, b) => Number(b.timeStamp) - Number(a.timeStamp)
			);

			if (allTxs.length > 0) {
				setTransactions((prev) => [...prev, ...allTxs]);
				setPage((prev) => prev + 1);
				setHasInitialFetch(true);
			} else {
				if (page === 1) {
					// first fetch and it's empty
					setTransactions([]);
					setHasInitialFetch(true); // ✅ mark first fetch as done
					setHasMore(false);
				} else {
					setHasMore(false); // scrolled all the way
				}
			}
		} catch (error) {
			console.log("Tx fetch error", error);
		} finally {
			setLoading(false);
		}
	}, [walletAddress, page, pageSize, loading, hasMore]);

	useEffect(() => {
		// reset when wallet changes
		setTransactions([]);
		setPage(1);
		setHasMore(true);
		setHasInitialFetch(false);
	}, [walletAddress, chainId]);

	return { transactions, loading, fetchTxs, hasMore, hasInitialFetch };
};
