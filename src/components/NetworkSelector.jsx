import React, { useState, useRef, useEffect } from "react";
import { SiEthereum } from "react-icons/si";
import { IoChevronDown } from "react-icons/io5";

const NetworkSelector = () => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	const toggleDropdown = () => {
		setIsOpen((prev) => !prev);
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div ref={dropdownRef} className="relative inline-block text-left">
			{/* Selector */}
			<div
				className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
				onClick={toggleDropdown}
			>
				{/* Icon Badge */}
				<div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600">
					<SiEthereum className="w-3.5 h-3.5" />
				</div>

				{/* Network Name */}
				<span className="text-gray-800 text-sm font-medium">
					Ethereum Mainnet
				</span>

				{/* Arrow */}
				<IoChevronDown
					className={`w-4 h-4 text-gray-500 transition-transform ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</div>

			{/* Dropdown Menu */}
			{isOpen && (
				<div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black/5 z-10 overflow-hidden">
					<div className="py-1">
						{/* Placeholder for your options */}
						<button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
							Option 1
						</button>
						<button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
							Option 2
						</button>
						<button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
							Option 3
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default NetworkSelector;
