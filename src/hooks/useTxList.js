import { useCallback, useEffect, useState } from "react";
import { apiCall } from "../utils/apiService";
import { useWallet } from "../context/WalletContext";

const VITE_ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;

export const useTxList = (pageSize = 20) => {
	const [transactions, setTransactions] = useState([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const { walletAddress } = useWallet();

	const fetchTxs = useCallback(async () => {
		const chainId = localStorage.getItem("chainId");
		if (!walletAddress || loading || !hasMore || !chainId) return;

		setLoading(true);

		try {
			const res = await apiCall({
				method: "get",
				url: "/api",
				params: {
					chainId: chainId,
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

			if (
				res?.success &&
				res?.data?.status === "1" &&
				res?.data?.result?.length > 0
			) {
				setTransactions((prev) => [...prev, ...res?.data?.result]);
				setPage((prev) => prev + 1);
			} else {
				setHasMore(false);
			}
		} catch (error) {
			console.log("Tx fetch error", error);
		} finally {
			setLoading(false);
		}
	}, [walletAddress, page, pageSize, loading, hasMore]);

	

	useEffect(() => {
		setTransactions([]);
		setPage(1);
		setHasMore(true);
	}, [walletAddress]);

	return { transactions, loading, fetchTxs, hasMore };
};
