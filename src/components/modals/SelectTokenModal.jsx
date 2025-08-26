import { IoIosClose } from "react-icons/io";
import { motion, AnimatePresence } from "motion/react";

const SelectTokenModal = ({
	isOpen,
	onClose,
	selectedOption,
	tokensList,
	chainId,
	balance,
	selectedAsset,
	setSelectedAsset,
}) => {
	// console.log(tokensList[chainId])
	// console.log("bln", balance);
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-[999] backdrop-blur w-full h-full flex items-center justify-center"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.25 }}
				>
					{/* Modal container */}
					<motion.div
						className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-300 bg-white mt-13 w-[20%] m-auto min-h-[35vh] flex flex-col rounded-lg overflow-hidden items-center justify-between"
						initial={{ opacity: 0, scale: 0.85, y: -40 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 40 }}
						transition={{ duration: 0.35, ease: "easeInOut" }}
					>
						<div className="w-full min-h-full">
							<div className="w-full flex flex-col items-end justify-between">
								<div className="w-[73%] mt-2 pr-2 flex items-center justify-between">
									<h2 className="font-semibold text-lg">
										Select asset to send
									</h2>
									<span onClick={onClose} className="cursor-pointer">
										<IoIosClose size={22} />
									</span>
								</div>
							</div>
							<div className="w-full mt-4 px-3 flex flex-col gap-2 pb-7">
								<span className="inline-flex bg-zinc-200 px-3 py-1 rounded-full w-fit text-xs">
									{selectedOption?.label}
								</span>
								<div className="tab-section">
									<div className="px-3 flex flex-col gap-2 items-center justify-center">
										<p>Tokens</p>
										<div className="border-b-2 w-full"></div>
									</div>
									<ul className="list-none mt-3 flex flex-col gap-2 ">
										{tokensList[chainId].map((asset, idx) => {
											return (
												<li
													onClick={() => {
														setSelectedAsset(asset);
														onClose();
													}}
													key={idx}
												>
													<div className="w-full flex items-center gap-2 overflow-y-scroll my-scroll">
														{selectedAsset &&
															asset?.symbol === selectedAsset?.symbol && (
																<span className="w-1 h-8 bg-black rounded-lg"></span>
															)}
														<div className="w-full hover:bg-zinc-100 cursor-pointer py-2 flex items-center justify-between px-3">
															<div className="flex items-center gap-1">
																<span className="inline-flex relative w-8 h-8 items-center justify-center bg-zinc-200 rounded-full">
																	{asset?.symbol?.slice(0, 1).toUpperCase()}
																	<span className="w-4 h-4 absolute -bottom-1 -right-1 rounded-full bg-zinc-100 text-[.7rem] flex items-center justify-center font-thin">
																		{chainId === 80002 ? "P" : "S"}
																	</span>
																</span>
																<div className="flex flex-col justify-center ml-2">
																	<span>{asset?.name}</span>
																	<span className="text-xs text-gray-500">
																		{asset?.symbol}
																	</span>
																</div>
															</div>
															<div className="flex flex-col items-end">
																<span className="text-lg">
																	{asset?.formattedBalance === 0
																		? balance
																		: asset?.formattedBalance}
																</span>
															</div>
														</div>
													</div>
												</li>
											);
										})}
									</ul>
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default SelectTokenModal;
