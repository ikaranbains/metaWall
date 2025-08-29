import { GoPlus } from "react-icons/go";

const SelectNewAccChainButton = ({ onClick, btnTitle }) => {
	return (
		<button
			onClick={onClick}
			className="flex items-center gap-5 border text-blue-600 hover:underline hover:underline-offset-4 py-2 cursor-pointer border-none outline-none text-lg"
		>
			{" "}
			<GoPlus size={20} /> {btnTitle}
		</button>
	);
};

export default SelectNewAccChainButton;
