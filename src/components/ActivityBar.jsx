import { useEffect, useRef, useState } from "react";
import { useTxList } from "../hooks/useTxList";
import { TbDotsVertical } from "react-icons/tb";
import { MdOutlineArrowOutward } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { GoPlus } from "react-icons/go";
import { BiRefresh } from "react-icons/bi";
import { useAccounts } from "../context/AccountsContext";
import { useNetwork } from "../context/NetworkContext";
import { formatNativeAmount, formatTokenAmount } from "../utils/utilityFn";

const ActivityBar = ({
	setShowImportModal,
	cachedBalance,
	refreshTokensList,
	refreshing,
	key2,
}) => {
	const [panelSelected, setPanelSelected] = useState(1);
	const loaderRef = useRef(null);
	const { selectedAccount } = useAccounts();
	const { selectedOption } = useNetwork();

	const walletAddress = selectedAccount?.address;
	const walletType = selectedAccount?.type; // "evm" or "sol"

	const { transactions, loading, fetchTxs, hasMore, hasInitialFetch } =
		useTxList();

	const [showMenu, setShowMenu] = useState(false);
	const menuRef = useRef(null);
	const tokensList = JSON.parse(localStorage.getItem("tokensList")) || [];

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setShowMenu(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [menuRef]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !loading) {
					fetchTxs();
				}
			},
			{ threshold: 1 }
		);
		if (loaderRef.current) observer.observe(loaderRef.current);
		return () => {
			if (loaderRef.current) observer.unobserve(loaderRef.current);
		};
	}, [fetchTxs, loading, hasMore]);

	// ----------------------------------------------------------
	// Helper: Render a single tx row depending on type
	// ----------------------------------------------------------
	const renderTransaction = (tx, idx) => {
		if (walletType === "evm") {
			const isSend = tx.from?.toLowerCase() === walletAddress?.toLowerCase();
			return (
				<div
					key={idx}
					className="pb-4 p-3 flex items-center justify-between border-b border-gray-200 last:border-b-0"
				>
					<div className="flex gap-3">
						<span className="w-10 h-10 bg-blue-100 relative rounded-full flex items-center justify-center">
							{isSend ? (
								<MdOutlineArrowOutward size={20} />
							) : (
								<GiReceiveMoney size={22} />
							)}
							<span className="w-5 h-5 absolute -bottom-1.5 -right-1.5 rounded-full bg-black text-white text-[.7rem] flex items-center justify-center font-thin">
								{selectedOption?.name?.[0]}
							</span>
						</span>
						<div className="flex justify-center flex-col">
							<span className="text-lg font-medium text-gray-800">
								{isSend ? "Sent" : "Received"}
							</span>
							<span className="text-xs text-gray-500">
								Hash: {tx.hash?.slice(0, 12)}...
							</span>
								<span className="text-xs text-gray-400">
								Block: {tx.blockNumber}
							</span>
							{tx.timeStamp && (
								<span className="text-xs text-gray-400">
									{new Date(Number(tx.timeStamp) * 1000).toLocaleString()}
								</span>
							)}
						</div>
					</div>
					<div className="text-xl">
						{tx.type === "token"
							? `${Number(tx.value) / 10 ** tx.tokenDecimal} ${tx.tokenSymbol}`
							: `${Number(tx.value) / 10 ** 18} ${
									selectedOption?.nativeCurrency?.symbol
							  }`}
					</div>
				</div>
			);
		}

		if (walletType === "sol") {
			return (
				<div
					key={idx}
					className="pb-4 p-3 flex items-center justify-between border-b border-gray-200 last:border-b-0"
				>
					<div className="flex gap-3">
						<span className="w-10 h-10 bg-green-100 relative rounded-full flex items-center justify-center">
							<GiReceiveMoney size={20} />
							<span className="w-5 h-5 absolute -bottom-1.5 -right-1.5 rounded-full bg-black text-white text-[.7rem] flex items-center justify-center font-thin">
								S
							</span>
						</span>
						<div className="flex justify-center flex-col">
							<span className="text-lg font-medium text-gray-800">
								Solana Tx
							</span>
							<span className="text-xs text-gray-500">
								Hash: {tx.hash?.slice(0, 12)}...
							</span>
							{tx.blockTime && (
								<span className="text-xs text-gray-400">
									{new Date(Number(tx.blockTime) * 1000).toLocaleString()}
								</span>
							)}
						</div>
					</div>
					<div className="text-xl">
						{/* Approximation: lamport change for the account */}
						{tx.meta && tx.meta.postBalances && tx.meta.preBalances
							? `${
									(tx.meta.postBalances[0] - tx.meta.preBalances[0]) / 1e9
							  } SOL`
							: "—"}
					</div>
				</div>
			);
		}

		return null;
	};

	// ----------------------------------------------------------

	return (
		<div className="w-full flex items-center flex-col px-10 py-3">
			<div className="w-full flex items-center justify-between">
				<div className="relative flex w-full">
					{/* Sliding underline */}
					<div
						className={`absolute bottom-0 h-0.5 bg-black transition-transform duration-100 ease-in-out`}
						style={{
							width: "50%",
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

			{/* Tokens/Activity Panel */}
			<div className="relative w-full mt-2 h-8 flex items-center justify-end px-2">
				<TbDotsVertical
					onClick={() => setShowMenu(true)}
					className="cursor-pointer select-none"
					size={18}
				/>
				{showMenu && (
					<div
						ref={menuRef}
						className="bg-white border border-gray-300 w-45 h-25 absolute top-8 right-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
					>
						<ul className="list-none">
							<li
								onClick={() => setShowImportModal(true)}
								className="flex items-center justify-center py-3 gap-4 hover:bg-zinc-100 border-b border-zinc-200 cursor-pointer"
							>
								<div className="w-[85%] flex items-center gap-4">
									<span>
										<GoPlus />
									</span>{" "}
									Import tokens
								</div>
							</li>
							<li
								onClick={refreshTokensList}
								className="flex items-center justify-center py-3 gap-4 hover:bg-zinc-100 border-b border-zinc-200 cursor-pointer"
							>
								<div className="w-[85%] flex items-center gap-4">
									<span>
										<BiRefresh />
									</span>{" "}
									Refresh list
								</div>
							</li>
						</ul>
					</div>
				)}
			</div>

			<div className="flex items-center w-full h-full mt-2">
				{/* Tokens Tab */}
				<div
					className={`w-full ${
						panelSelected === 1 ? "block" : "hidden"
					} h-[45vh] overflow-y-scroll my-scroll`}
				>
					{refreshing ? (
						<p className="mt-10 text-gray-500 text-sm select-none animate-pulse">
							Refreshing list...
						</p>
					) : tokensList[key2]?.length ? (
						tokensList[key2]?.map((token, index) => {
							return (
								<div
									key={index}
									className="w-full flex flex-col gap-2 overflow-y-scroll my-scroll"
								>
									<div className="w-full hover:bg-zinc-100 cursor-pointer py-2 flex items-center justify-between px-3">
										<div className="flex items-center gap-1">
											<span className="inline-flex relative w-8 h-8 items-center justify-center bg-zinc-200 rounded-full">
												{token?.symbol?.slice(0, 1).toUpperCase()}
												<span className="w-4 h-4 absolute -bottom-1 -right-1 rounded-full bg-zinc-100 text-[.7rem] flex items-center justify-center font-thin">
													{selectedOption?.name?.slice(0, 1).toUpperCase()}
												</span>
											</span>
											<div className="flex flex-col justify-center ml-2">
												<span>{token?.symbol}</span>
												<img
													src="src/assets/triangle-up.svg"
													className="w-3"
													alt="triangle"
												/>
											</div>
										</div>
										<div className="flex flex-col items-end">
											<span className="text-lg font-semibold">
												{token?.price ? token?.price : token?.message}
											</span>
											<span className="text-sm text-gray-500">
												{token?.formattedBalance === 0
													? cachedBalance
													: token.formattedBalance}
											</span>
										</div>
									</div>
								</div>
							);
						})
					) : (
						<p className="mt-10 text-gray-400 text-sm select-none">
							No tokens yet
						</p>
					)}
				</div>

				{/* Activity Tab */}
				<div
					className={`w-full ${
						panelSelected === 2 ? "block" : "hidden"
					} h-[45vh] overflow-y-scroll my-scroll`}
				>
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
							<div key={date} className="w-full">
								<h2 className="text-gray-500 mt-3 mb-2">{date}</h2>
								<div className="flex flex-col gap-3">
									{txs.map((tx, idx) => (
										<div
											key={idx}
											className={`pb-4 p-3 flex items-center justify-between ${
												idx === txs.length - 1 ? "" : "border-b border-gray-200"
											} last:border-b-0`}
										>
											<div className="flex gap-3">
												<span className="w-10 h-10 bg-blue-100 relative rounded-full flex items-center justify-center">
													{tx.from.toLowerCase() ===
													walletAddress.toLowerCase() ? (
														<MdOutlineArrowOutward size={20} />
													) : (
														<GiReceiveMoney size={22} />
													)}
													<span className="w-5 h-5 absolute -bottom-1.5 -right-1.5 rounded-full bg-black text-white text-[.7rem] flex items-center justify-center font-thin">
														{selectedOption?.name?.slice(0, 1).toUpperCase()}
													</span>
												</span>
												<div className="flex justify-center flex-col">
													<span className="text-lg font-medium text-gray-800">
														{tx.from.toLowerCase() ===
														walletAddress.toLowerCase()
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
											</div>
											<div className="text-xl">
												<div className="text-xl">
													{tx.type === "token"
														? formatTokenAmount(
																tx.value,
																tx.tokenDecimal,
																tx.tokenSymbol
														  )
														: formatNativeAmount(
																tx.value,
																selectedOption?.nativeCurrency?.symbol
														  )}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>

					{transactions.length === 0 && hasInitialFetch && !loading && (
						<p className="text-center text-gray-400 text-sm">
							No transactions yet
						</p>
					)}

					{transactions.map((tx, idx) => renderTransaction(tx, idx))}

					{loading && <p className="text-center text-gray-500">Loading...</p>}
					<div ref={loaderRef} className="h-10"></div>
					{/* {!hasMore && (
						<p className="text-center text-gray-400 text-xl">
							No more transactions
						</p>
					)} */}
				</div>
			</div>
		</div>
	);
};

export default ActivityBar;
