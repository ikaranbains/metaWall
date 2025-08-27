import React from "react";
import { IoIosClose } from "react-icons/io";
import { motion, AnimatePresence } from "motion/react";
import ModalHeader from "../common/ModalHeader";

const EditAccountNameModal = ({
	isOpen,
	onClose,
	disabled,
	accountName,
	accountNameInput,
	setAccountNameInput,
	handleAccountName,
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
						className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-300 bg-white mt-13 w-[20%] m-auto min-h-[25vh] flex flex-col rounded-lg overflow-hidden items-center justify-between"
						initial={{ opacity: 0, scale: 0.85, y: -40 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 40 }}
						transition={{ duration: 0.35, ease: "easeInOut" }}
					>
						<div className="w-full min-h-full mb-4">
							<ModalHeader title="Edit account name" onClose={onClose} />

							<div className="w-full my-4 px-3 flex flex-col gap-2">
								<p className="font-medium">Name</p>
								<input
									value={accountNameInput}
									onChange={(e) => setAccountNameInput(e.target.value)}
									type="text"
									placeholder={accountName}
									name="accountName"
									className="border border-gray-400 w-full rounded-lg px-3 py-2 focus:border-black"
								/>
							</div>
						</div>

						<div className="w-full px-5 mb-3">
							<button
								onClick={() => handleAccountName()}
								className={`text-white w-full py-1.5 mt-5 text-lg rounded-lg ${
									!disabled
										? "bg-black hover:bg-zinc-900 cursor-pointer"
										: "bg-zinc-400 cursor-not-allowed"
								}`}
							>
								Save
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default EditAccountNameModal;
