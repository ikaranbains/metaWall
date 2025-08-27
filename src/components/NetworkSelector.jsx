import { useRef } from "react";
import { chainConfigs } from "../utils/constants";
import Select from "react-select";

const NetworkSelector = ({ selectedOption, handleChange }) => {
	const dropdownRef = useRef(null);

	const customStyles = {
		control: (base) => ({
			...base,
			border: "none",
			boxShadow: "none",
			backgroundColor: "transparent",
			"&:hover": {
				border: "none",
			},
			display: "flex",
			alignItems: "center",
			minHeight: "25px",
			height: "25px",
			borderRadius: "0.5rem",
			width: "160px", // optional fixed width
			padding: "0 0",
		}),
		valueContainer: (base) => ({
			...base,
			maringLeft: "0px", // ✅ same left/right as options
			padding: "0 5px 2px 5px",
			height: "25px",
			display: "flex",
			alignItems: "center",
		}),
		singleValue: (base) => ({
			...base,
			margin: 0, // ✅ remove react-select margin
			color: "#111827",
			fontSize: "0.875rem",
			padding: "0 0",
			lineHeight: "1rem",
			display: "flex",
			alignItems: "center",
		}),
		input: (base) => ({
			...base,
			margin: 0,
			padding: 0,
		}),
		option: (base, state) => ({
			...base,
			fontSize: "0.875rem",
			padding: "10px 10px", // ✅ match valueContainer left padding
			backgroundColor: state.isFocused ? "#f3f4f6" : "white",
			color: "#111827",
			cursor: "pointer",
			"&:active": {
				backgroundColor: "#e5e7eb",
			},
		}),
		menu: (base) => ({
			...base,
			borderRadius: "0.5rem",
			marginTop: "0.5rem",
			boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
			width: "180px",
			position: "absolute",
			left: -9, // ✅ match control
		}),
		menuList: (base) => ({
			...base,
			padding: 0, // ✅ remove default padding around options
		}),
		dropdownIndicator: (base) => ({
			// dropdown wali arrow
			...base,
			color: "#6b7280",
			"&:hover": { color: "#111827" },
			padding: "0 0 2px 4px",
			display: "flex",
			alignItems: "center",
		}),
		indicatorSeparator: () => ({
			display: "none",
		}),
	};

	return (
		<div ref={dropdownRef} className="relative inline-block text-left">
			{/* Selector */}
			<div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
				<Select
					value={chainConfigs.find(c => c.chainId === selectedOption?.chainId) || null}
					onChange={handleChange}
					options={chainConfigs}
					styles={customStyles}
					className="text-sm"
					isClearable={false}
					isDisabled={false}
					isSearchable={false}
					placeholder="Select Chain"
				/>
			</div>
		</div>
	);
};

export default NetworkSelector;
