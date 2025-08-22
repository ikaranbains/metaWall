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
	setShowTokenDetails,
}) => {
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
												<div className="w-full h-13 rounded-xl mt-2 flex items-center border-2 border-gray-300 focus-within:border-black overflow-hidden">
													<input
														value="wDione"
														type="text"
														className="outline-none border-none  p-3 w-full"
													/>
												</div>
											</div>

											<div className="w-full">
												<p>Token Decimals</p>
												<div className="w-full h-13 rounded-xl mt-2 flex items-center cursor-not-allowed border-2 border-gray-300 focus-within:border-black overflow-hidden">
													<input
														disabled
														value="18"
														type="number"
														className="outline-none border-none text-gray-400  p-3 w-full"
													/>
												</div>
											</div>
										</>
									)}
								</form>
							</div>
						</div>

						<div className="w-full px-5 mb-3">
							{!showTokenDetails ? (
								<button
									onClick={() => setShowTokenDetails(true)}
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
								<button
									onClick={() => toast.success("Tokens imported!!")}
									className={`text-white w-full py-2 text-xl rounded-lg bg-black hover:bg-zinc-900 cursor-pointer`}
								>
									Import Token
								</button>
							)}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ImportTokensModal;
