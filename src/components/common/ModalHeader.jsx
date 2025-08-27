import React from "react";
import { IoIosClose } from "react-icons/io";

const ModalHeader = ({ title, onClose }) => {
	return (
		<div className="relative w-full mt-2 pr-2 flex items-center justify-between">
			<h2 className="absolute left-1/2 -translate-x-1/2 font-semibold text-lg">
				{title}
			</h2>
			<span
				onClick={onClose}
				className="ml-auto cursor-pointer hover:text-red-500 transition"
			>
				<IoIosClose size={22} />
			</span>
		</div>
	);
};

export default ModalHeader;
