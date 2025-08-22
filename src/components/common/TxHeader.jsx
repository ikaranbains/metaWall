import React from "react";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const TxHeader = ({className, title, onClick}) => {
    const navigate = useNavigate();
	return (
		<nav className={`w-full flex items-center ${className}`}>
			<span onClick={onClick} className="pl-3 cursor-pointer">
				<MdOutlineKeyboardArrowLeft size={24} />
			</span>
			<h2 className="font-medium text-2xl m-auto">{title}</h2>
		</nav>
	);
};

export default TxHeader;
