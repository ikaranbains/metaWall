import React from "react";

const AccountStrip = ({ title, p = "", icon, onClick }) => {
	return (
		<div
			onClick={onClick}
			className="w-full h-13 bg-gray-100 flex items-center justify-between px-4 cursor-pointer hover:bg-gray-200"
		>
			<h2 className="text-lg">{title}</h2>
			<div className="flex items-center gap-2 text-zinc-500">
				<p>{p}</p>
				{icon}
			</div>
		</div>
	);
};

export default AccountStrip;
