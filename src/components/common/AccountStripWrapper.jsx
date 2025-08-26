import React from "react";

const AccountStripWrapper = ({ children }) => {
	return (
		<div className="w-full rounded-lg overflow-hidden flex flex-col gap-[0.9px]">
			{children}
		</div>
	);
};

export default AccountStripWrapper;
