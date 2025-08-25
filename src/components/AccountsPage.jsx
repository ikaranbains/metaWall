import React from "react";
import TxHeader from "./common/TxHeader";

const AccountsPage = () => {
	return (
		<div className="w-full h-full flex items-center justify-center">
			<div className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-300 bg-white mt-13 w-[30%] m-auto min-h-[90vh] flex flex-col">
				<TxHeader
					onClick={() => navigate("/home")}
					className="mt-3 justify-between"
					title="Account Details"
				/>

				<div className="mt-10 h-190 flex flex-col justify-between pb-10 px-5">
					<div className="flex flex-col gap-10"></div>
					<div className="flex items-center justify-between gap-3"></div>
				</div>
			</div>
		</div>
	);
};

export default AccountsPage;
