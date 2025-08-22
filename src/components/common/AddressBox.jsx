import React from "react";
import DeterministicPieIcon from "./DeterministicPieIcon";
import { IoClose } from "react-icons/io5";
import Address from "./Address";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const AddressBox = ({
	address,
	onClick = () => {},
	close,
	title,
	addressClass,
	parentClass,
}) => {
	return (
		<div className="border border-gray-300 mt-2 rounded-lg py-2 px-3 flex items-center justify-between">
			<div className={`flex items-center gap-5 ${parentClass} `}>
				{address && <DeterministicPieIcon address={address} size={18} />}
				<div>
					<p>{title}</p>
					<Address address={address} className={addressClass} />
				</div>
			</div>
			<span onClick={onClick} className="cursor-pointer">
				{close ? (
					<IoClose size={20} />
				) : (
					<MdOutlineKeyboardArrowDown size={20} />
				)}
			</span>
		</div>
	);
};

export default AddressBox;
