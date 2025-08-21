import { motion, AnimatePresence } from "motion/react";

const TxSuccessModal = ({ show, onClose }) => {
	return (
		<AnimatePresence>
			{show && (
				<motion.div
					className="fixed inset-0 backdrop-blur-lg bg-opacity-70 flex items-center justify-center z-50"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<motion.div
						className="bg-white text-black rounded-lg shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-300 w-96 p-6 flex flex-col items-center"
						initial={{ scale: 0.8, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.8, opacity: 0, y: 20 }}
						transition={{ type: "spring", stiffness: 200, damping: 20 }}
					>
						{/* Animated Checkmark */}
						<motion.svg
							width="80"
							height="80"
							viewBox="0 0 52 52"
							className="mb-4"
						>
							<motion.circle
								cx="26"
								cy="26"
								r="25"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="text-black opacity-20"
							/>
							<motion.path
								d="M14 27l7 7 16-16"
								fill="none"
								stroke="currentColor"
								strokeWidth="4"
								strokeLinecap="round"
								strokeLinejoin="round"
								initial={{ pathLength: 0, opacity: 0 }}
								animate={{ pathLength: 1, opacity: 1 }}
								transition={{ duration: 0.5, ease: "easeInOut" }}
							/>
						</motion.svg>

						<h2 className="text-2xl font-bold mb-2">Transaction Successful</h2>
						<p className="text-gray-600 text-center mb-6">
							Your transaction has been confirmed on the blockchain.
						</p>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default TxSuccessModal;
