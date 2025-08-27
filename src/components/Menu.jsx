import React, { useEffect, useRef, useState } from "react";
import { useNetwork } from "../context/NetworkContext";
import { LuSettings, LuSquareArrowOutUpRight } from "react-icons/lu";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { IoIosMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAccounts } from "../context/AccountsContext";

const Menu = () => {
	const [menu, setMenu] = useState(false);
	const menuRef = useRef(null);
	const { selectedOption } = useNetwork();
	const { selectedAccount } = useAccounts();
	const walletAddress = selectedAccount?.address;
	const navigate = useNavigate();

	useEffect(() => {
		const handleClickOutside = (event) => {
			// ✅ Close if clicked outside the menuRef element
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setMenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			// ✅ cleanup on unmount
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [menuRef]);

	return (
		<div className="select-none relative">
			<span
				onClick={() => setMenu((prev) => !prev)}
				className="hover:text-lg cursor-pointer"
			>
				{!menu ? <IoIosMenu size={20} /> : <IoClose size={20} />}
			</span>
			{menu && (
				<div
					ref={menuRef}
					className="w-50 bg-white rounded-lg absolute right-0 top-7 shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
				>
					<ul className="list-none">
						<li className="flex items-center justify-center py-3 gap-4 hover:bg-zinc-100 border-b border-zinc-200 cursor-pointer">
							{" "}
							<div
								onClick={() => navigate("/account-details")}
								className="w-[85%] flex items-center gap-4"
							>
								<span>
									<MdOutlineQrCodeScanner />
								</span>{" "}
								Account details
							</div>
						</li>
						<li className="flex items-center justify-center py-3 gap-4 hover:bg-zinc-100 border-b border-zinc-200 cursor-pointer">
							{" "}
							<a
								href={`${selectedOption?.blockExplorerUrls[0]}/address/${walletAddress}`}
								target="_blank"
								className="w-[85%] flex items-center gap-4"
							>
								<span>
									<LuSquareArrowOutUpRight />
								</span>{" "}
								<h2
									title={selectedOption?.blockExplorerUrls[0]}
									className="flex items-center flex-col"
								>
									View on explorer
									<p className="text-sm text-zinc-400">
										{selectedOption?.blockExplorerUrls[0].substring(0, 17) +
											"..."}
									</p>
								</h2>
							</a>
						</li>
						<li className="flex items-center justify-center py-3 gap-4 hover:bg-zinc-100 border-b border-zinc-200 cursor-pointer">
							{" "}
							<div className="w-[85%] flex items-center gap-4">
								<span>
									<LuSettings />
								</span>{" "}
								Settings
							</div>
						</li>
					</ul>
				</div>
			)}
		</div>
	);
};

export default Menu;
