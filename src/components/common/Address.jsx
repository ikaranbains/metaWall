import React from "react";

const Address = ({ address, className }) => {
	return (
		<p className={className}>
			{address ? `${address.slice(0, 6)}...${address.slice(-7)}` : "not found"}
		</p>
	);
};

export default Address;
