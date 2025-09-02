import { useCallback, useEffect, useState } from "react";
import { apiCall } from "../utils/apiService";
import { useAccounts } from "../context/AccountsContext";
import { useNetwork } from "../context/NetworkContext";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

const VITE_ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;

export const useTxList = (pageSize = 20) => {
	const [transactions, setTransactions] = useState([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [hasInitialFetch, setHasInitialFetch] = useState(false);

	const { selectedAccount } = useAccounts();
	const walletAddress = selectedAccount?.address;
	const walletType = selectedAccount?.type; // "evm" or "sol"
	const { selectedOption } = useNetwork();
	const chainId = selectedOption?.chainId; // null for Solana

	// ---------- Fetch EVM transactions ----------
	const fetchEvmTxs = useCallback(async () => {
		try {
			// 1. Native transfers
			const nativeRes = await apiCall({
				method: "get",
				url: "/api",
				params: {
					module: "account",
					action: "txlist",
					address: walletAddress,
					startblock: 0,
					endblock: 99999999,
					page,
					offset: pageSize,
					sort: "desc",
					apikey: VITE_ETHERSCAN_API_KEY,
					chainId,
				},
			});

			// 2. ERC20 transfers
			const tokenRes = await apiCall({
				method: "get",
				url: "/api",
				params: {
					module: "account",
					action: "tokentx",
					address: walletAddress,
					startblock: 0,
					endblock: 99999999,
					page,
					offset: pageSize,
					sort: "desc",
					apikey: VITE_ETHERSCAN_API_KEY,
					chainId,
				},
			});

			const nativeTxs =
				nativeRes?.success && nativeRes?.data?.status === "1"
					? nativeRes.data.result.map((tx) => ({
							...tx,
							type: "native",
							timestamp: Number(tx.timeStamp), // ✅ guarantee numeric `timestamp`
					  }))
					: [];

			const tokenTxs =
				tokenRes?.success && tokenRes?.data?.status === "1"
					? tokenRes.data.result.map((tx) => ({
							...tx,
							type: "token",
							timestamp: Number(tx.timeStamp), // ✅ same here
					  }))
					: [];

			return [...nativeTxs, ...tokenTxs];
		} catch (err) {
			console.error("❌ EVM tx fetch error", err);
			return [];
		}
	}, [walletAddress, page, pageSize, chainId]);

	// ---------- Fetch Solana transactions ----------
	const fetchSolTxs = useCallback(async () => {
		try {
			const connection = new Connection(
				selectedOption?.rpc ||
					clusterApiUrl(selectedOption?.network || "testnet")
			);

			// pull recent signatures
			const signatures = await connection.getSignaturesForAddress(
				new PublicKey(walletAddress),
				{
					limit: pageSize,
					before: undefined, // Pagination could be added via last signature
				}
			);

			if (!signatures.length) return [];

			const detailed = await connection.getParsedTransactions(
				signatures.map((s) => s.signature),
				{ maxSupportedTransactionVersion: 0 }
			);

			const solTxs = detailed.filter(Boolean).map((tx, i) => ({
				hash: tx.transaction.signatures[0],
				type: "solana",
				transaction: tx.transaction,
				meta: tx.meta,
				timestamp:
					tx.blockTime ||
					signatures[i]?.blockTime || // fallback
					Math.floor(Date.now() / 1000), // as a last resort
			}));

			return solTxs;
		} catch (err) {
			console.error("❌ Solana tx fetch error", err);
			return [];
		}
	}, [walletAddress, pageSize, selectedOption]);

	// ---------- Unified fetch ----------
	const fetchTxs = useCallback(async () => {
		if (!walletAddress || loading || !hasMore) return;

		setLoading(true);

		let allTxs = [];
		if (walletType === "evm" && chainId) {
			allTxs = await fetchEvmTxs();
		} else if (walletType === "sol") {
			allTxs = await fetchSolTxs();
		}

		if (allTxs.length > 0) {
			setTransactions((prev) => [
				...prev,
				...allTxs.sort((a, b) => Number(b.timestamp) - Number(a.timestamp)),
			]);
			setPage((prev) => prev + 1);
			setHasInitialFetch(true);
		} else {
			if (page === 1) {
				setTransactions([]);
				setHasInitialFetch(true);
				setHasMore(false);
			} else {
				setHasMore(false);
			}
		}

		setLoading(false);
	}, [
		walletAddress,
		loading,
		hasMore,
		page,
		walletType,
		chainId,
		fetchEvmTxs,
		fetchSolTxs,
	]);

	// reset tx state when account/chain/type changes
	useEffect(() => {
		setTransactions([]);
		setPage(1);
		setHasMore(true);
		setHasInitialFetch(false);
	}, [walletAddress, walletType, chainId]);

	return { transactions, loading, fetchTxs, hasMore, hasInitialFetch };
};
