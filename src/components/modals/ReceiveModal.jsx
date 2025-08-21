import { IoIosClose } from "react-icons/io";
import { GoCopy } from "react-icons/go";

const ReceiveModal = ({ walletAddress, onClose }) => {
	return (
		<div className="fixed inset-0 z-[9999] backdrop-blur w-full h-full flex items-center justify-center">
			<div className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-300 bg-white mt-13 w-[22%] m-auto h-[45vh] flex flex-col rounded-lg overflow-hidden">
				<div className="w-full flex flex-col items-end justify-between">
					<div className="w-[60%] mt-2 pr-2 flex items-center justify-between">
						<h2 className="font-semibold text-xl">Receive</h2>
						<span onClick={onClose} className="cursor-pointer">
							<IoIosClose size={22} />
						</span>
					</div>
				</div>
				<div className=" h-full flex flex-col items-center justify-center gap-3">
					<div className="w-50 h-50 rounded-xl border border-gray-300">
						<div className="flex items-center justify-center w-full h-full">QR</div>
					</div>
					<p>Account 1</p>
					<p className="w-65 whitespace-normal break-all text-center">
						{walletAddress.slice(0, 6)}
						<span className="text-gray-400">{walletAddress.slice(6, 35)}</span>
						{walletAddress.slice(36)}
					</p>
					<span className="flex items-center justify-center gap-2 text-blue-700 cursor-pointer hover:text-blue-500">
						<GoCopy />
						Copy address
					</span>
				</div>
			</div>
		</div>
	);
};

export default ReceiveModal;
