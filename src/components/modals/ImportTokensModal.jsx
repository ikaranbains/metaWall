import { IoIosClose } from "react-icons/io";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";

const ImportTokensModal = ({
	isOpen,
	onClose,
	selectedOption,
	tokenAddress,
	onChange,
	disabled,
	showTokenDetails,
	tokensList,
	setStep2,
	step2,
	handleImportToken,
}) => {
	const chain = selectedOption?.chainId;
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
						className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-300 bg-white mt-13 w-[22%] m-auto min-h-[50vh] flex flex-col rounded-lg overflow-hidden items-center justify-between"
						initial={{ opacity: 0, scale: 0.85, y: -40 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 40 }}
						transition={{ duration: 0.35, ease: "easeInOut" }}
					>
						<div className="w-full min-h-full mb-4">
							<div className="w-full flex flex-col items-end justify-between">
								<div className="w-[65%] mt-2 pr-2 flex items-center justify-between">
									<h2 className="font-semibold text-xl">Import Tokens</h2>
									<span onClick={onClose} className="cursor-pointer">
										<IoIosClose size={22} />
									</span>
								</div>
							</div>

							{step2 ? (
								<div>
									<p className="text-lg text-center mt-2">
										Would you like to import this token ?
									</p>
									<div className="w-full flex items-center gap-2 pl-6 mt-4">
										<span className="inline-flex w-8 h-8 items-center justify-center bg-zinc-200 rounded-full">
											{tokensList &&
												tokensList[chain]
													?.find((item) => item.address === tokenAddress)
													?.name.slice(0, 1)
													.toUpperCase()}
										</span>
										<div className="flex flex-col justify-center ml-2">
											<span>
												{tokensList &&
													tokensList[chain]?.find(
														(item) => item.address === tokenAddress
													)?.name}
											</span>
											<p className="text-gray-500 text-sm">
												{tokensList &&
													tokensList[chain]?.find(
														(item) => item.address === tokenAddress
													)?.decimals}
											</p>
										</div>
									</div>
								</div>
							) : (
								<div
									className={`max-h-[35vh] flex flex-col items-center py-10 gap-5 px-5 ${
										showTokenDetails ? "overflow-y-scroll" : "overflow-hidden"
									} modal-content`}
								>
									<div className="w-full min-h-13 rounded-xl flex items-center justify-center border-2 border-gray-300 overflow-hidden">
										<p>Selected network:</p>
										<span className="inline-flex px-3 py-1 rounded-lg">
											{selectedOption?.label}
										</span>
									</div>

									<form className="w-full flex flex-col gap-4">
										<div className="w-full">
											<p>Token Contract Address</p>
											<div className="w-full h-13 rounded-xl mt-2 flex items-center border-2 border-gray-300 focus-within:border-black overflow-hidden">
												<input
													value={tokenAddress}
													type="text"
													placeholder="Enter token address..."
													className="outline-none border-none  p-3 w-full"
													onChange={onChange}
												/>
											</div>
										</div>
										{showTokenDetails && tokenAddress && (
											<>
												<div className="w-full">
													<p>Token Symbol</p>
													<div className="w-full h-13 rounded-xl mt-2 flex items-center border-2 border-gray-300 overflow-hidden">
														{/* <input
														readOnly
														value="wDione"
														type="text"
														className="outline-none border-none  p-3 w-full"
													/> */}
														<p className="px-3">
															{tokensList &&
																tokensList[chain].find(
																	(item) => item.address === tokenAddress
																).symbol}
														</p>
													</div>
												</div>

												<div className="w-full">
													<p>Token Decimals</p>
													<div className="w-full h-13 rounded-xl mt-2 flex items-center cursor-not-allowed border-2 border-gray-300 focus-within:border-black overflow-hidden">
														<p className="text-gray-400  p-3 w-full">
															{tokensList &&
																tokensList[chain].find(
																	(item) => item.address === tokenAddress
																).decimals}
														</p>
													</div>
												</div>
											</>
										)}
									</form>
								</div>
							)}
						</div>

						<div className="w-full px-5 mb-3">
							{!step2 ? (
								<button
									onClick={() => setStep2(true)}
									disabled={disabled}
									className={`text-white w-full py-2 text-xl rounded-lg ${
										!disabled
											? "bg-black hover:bg-zinc-900 cursor-pointer"
											: "bg-zinc-400 cursor-not-allowed"
									}`}
								>
									Next
								</button>
							) : (
								<div className="flex items-center gap-3 justify-center">
									<button
										onClick={() => setStep2(false)}
										className="w-full py-2 text-xl rounded-lg bg-zinc-200 hover:bg-zinc-300 cursor-pointer"
									>
										Back
									</button>
									<button
										onClick={handleImportToken}
										className={`text-white w-full py-2 text-xl rounded-lg bg-black hover:bg-zinc-900 cursor-pointer`}
									>
										Import Token
									</button>
								</div>
							)}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ImportTokensModal;
