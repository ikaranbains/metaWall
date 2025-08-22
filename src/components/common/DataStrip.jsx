import React from "react";

const DataStrip = ({ children }) => {
	return (
		<div className="w-full bg-white h-20 rounded-lg flex items-center justify-between px-4">
			{children}
		</div>
	);
};

export default DataStrip;
