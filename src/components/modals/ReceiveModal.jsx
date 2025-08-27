import { IoIosClose } from "react-icons/io";
import QRCode from "react-qr-code";
import { useState } from "react";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import ModalHeader from "../common/ModalHeader";
import { useAccounts } from "../../context/AccountsContext";

const ReceiveModal = ({ walletAddress, onClose, isOpen }) => {
	const [copy, setCopy] = useState(false);

	const copyHandler = () => {
		setCopy(true);
		navigator.clipboard
			.writeText(walletAddress)
			.then(() => {
				toast.success("Copied to Clipboard", {
					className: "relative top-0 z-[9999]",
				});
			})
			.catch((err) => console.log("error", err));
		setTimeout(() => setCopy(false), 2000);
	};
	const { selectedAccount } = useAccounts();
	const accountName = selectedAccount?.name;

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
						className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-300 bg-white mt-13 w-[22%] m-auto h-[45vh] flex flex-col rounded-lg overflow-hidden"
						initial={{ opacity: 0, scale: 0.85, y: -40 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 40 }}
						transition={{ duration: 0.35, ease: "easeInOut" }}
					>
						{/* Header */}
						<ModalHeader title="Receive" onClose={onClose} />

						{/* Body */}
						<div className=" h-full flex flex-col items-center justify-center gap-3">
							<div className="w-50 h-50 rounded-xl border border-gray-300 overflow-hidden">
								<div className="flex items-center justify-center w-full h-full">
									<QRCode value={walletAddress} size={160} />
								</div>
							</div>
							<p>{accountName}</p>
							<p className="w-65 whitespace-normal break-all text-center">
								{walletAddress.slice(0, 6)}
								<span className="text-gray-400">
									{walletAddress.slice(6, 35)}
								</span>
								{walletAddress.slice(36)}
							</p>
							<span
								onClick={copyHandler}
								className="flex items-center justify-center gap-2 text-blue-700 cursor-pointer hover:text-blue-500"
							>
								{copy ? <LuCopyCheck size={17} /> : <LuCopy size={17} />}
								Copy address
							</span>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ReceiveModal;
