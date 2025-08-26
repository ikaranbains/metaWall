import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import toast from "react-hot-toast";
import DeterministicPieIcon from "./common/DeterministicPieIcon";
import Address from "./common/Address";
import { useWallet } from "../context/WalletContext";

const Accounts = ({ address }) => {
	const [copy, setCopy] = useState(false);

	const copyHandler = () => {
		setCopy(true);
		navigator.clipboard
			.writeText(address)
			.then(() => {
				toast.success("Copied to Clipboard", {
					className: "relative top-0 z-[9999	]",
				});
			})
			.catch((err) => console.log("error", err));
		setTimeout(() => setCopy(false), 2000);
	};

	const { accountName } = useWallet();

	return (
		<div className="flex items-center flex-col gap-2 justify-center mr-45">
			<div className="flex items-center justify-center gap-3 hover:bg-zinc-200 px-2 py-0.5 rounded cursor-pointer">
				<div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
					{address && <DeterministicPieIcon address={address} size={18} />}
				</div>{" "}
				<h2>{accountName}</h2>
				<span className="">
					<IoIosArrowDown size={13} />
				</span>
			</div>
			<h2 className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
				<Address address={address} />
				<span onClick={copyHandler} className="cursor-pointer">
					{copy ? <LuCopyCheck size={17} /> : <LuCopy size={17} />}
				</span>
			</h2>
		</div>
	);
};

export default Accounts;
