import { useEffect, useRef, useState } from "react";
import { useTxList } from "../hooks/useTxList";
import { useWallet } from "../context/WalletContext";

const ActivityBar = () => {
	const [panelSelected, setPanelSelected] = useState(1);
	const { walletAddress } = useWallet();
	const { transactions, loading, fetchTxs, hasMore } = useTxList();
	const loaderRef = useRef(null);
	const chainId = localStorage.getItem("chainId");

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !loading) {
					fetchTxs();
				}
			},
			{ threshold: 1 }
		);

		if (loaderRef.current) {
			observer.observe(loaderRef.current);
		}

		return () => {
			if (loaderRef.current) observer.unobserve(loaderRef.current);
		};
	}, [fetchTxs, loading, hasMore]);

	return (
		<div className="w-full flex items-center flex-col px-10 py-3">
			<div className="w-full flex items-center justify-between">
				<div className="relative flex w-full">
					{/* Sliding underline */}
					<div
						className={`absolute bottom-0 h-0.5 bg-black transition-transform duration-300 ease-in-out`}
						style={{
							width: "50%", // since you have 2 tabs
							transform:
								panelSelected === 1 ? "translateX(0%)" : "translateX(100%)",
						}}
					></div>

					<div
						onClick={() => setPanelSelected(1)}
						className="w-1/2 flex items-center justify-center py-2 cursor-pointer border-b-2 border-zinc-300"
					>
						<h2
							className={`text-lg transition-colors duration-200 ${
								panelSelected === 1 ? "text-black" : "text-zinc-400"
							} hover:text-black`}
						>
							Tokens
						</h2>
					</div>

					<div
						onClick={() => setPanelSelected(2)}
						className="w-1/2 flex items-center justify-center py-2 cursor-pointer border-b-2 border-zinc-300"
					>
						<h2
							className={`text-lg transition-colors duration-200 ${
								panelSelected === 2 ? "text-black" : "text-zinc-400"
							} hover:text-black`}
						>
							Activity
						</h2>
					</div>
				</div>
			</div>

			<div className="flex items-center w-full h-full mt-5">
				<div
					className={`w-full ${
						panelSelected === 1 ? "block" : "hidden"
					} flex items-center justify-center`}
				>
					<p className="mt-10 text-gray-400 text-sm">No tokens yet</p>
				</div>
				<div className={`w-full ${panelSelected === 2 ? "block" : "hidden"} `}>
					<div className="flex flex-col gap-3">
						{Object.entries(
							transactions.reduce((acc, tx) => {
								const dateKey = new Date(
									Number(tx.timeStamp) * 1000
								).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric",
								});
								if (!acc[dateKey]) acc[dateKey] = [];
								acc[dateKey].push(tx);
								return acc;
							}, {})
						).map(([date, txs]) => (
							<div key={date} className="w-full 	">
								<h2 className="text-md font-bold text-gray-700 mt-3 mb-2">
									{date}
								</h2>
								<div className="flex flex-col gap-3">
									{txs.map((tx) => (
										<div
											key={tx.hash}
											className="border rounded-lg p-3 flex items-center justify-between shadow-sm"
										>
											<div className="flex justify-center flex-col">
												<span className="text-lg font-medium text-gray-800">
													{tx.from.toLowerCase() === walletAddress.toLowerCase()
														? "Sent"
														: "Received"}
												</span>
												<span className="text-xs text-gray-500">
													Hash: {tx.hash.slice(0, 12)}...
												</span>
												<span className="text-xs text-gray-400">
													Block: {tx.blockNumber}
												</span>
											</div>
											<div className="text-xl">
												{Number(tx.value) / 1e18}{" "}
												{chainId && Number(chainId) === 80002
													? "POL"
													: "SepoliaETH"}
											</div>
										</div>
									))}
								</div>
							</div>
						))}

						{loading && <p className="text-center text-gray-500">Loading...</p>}
						<div ref={loaderRef} className="h-10"></div>
						{!hasMore && (
							<p className="text-center text-gray-400 text-sm">
								No more transactions
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ActivityBar;
