import React from "react";
import { useNavigate } from "react-router-dom";

const TxButtons = ({
	showStep2,
	form1 = "",
	form2 = "",
	type = "button",
	disabled,
	review = false,
	onClick = () => {},
}) => {
	const navigate = useNavigate();
	return (
		<>
			<button
				onClick={() => navigate("/home")}
				className=" bg-gray-200 cursor-pointer w-1/2 py-2 text-lg rounded-lg hover:bg-gray-300 "
			>
				Cancel
			</button>
			{!review ? (
				!showStep2 ? (
					<button
						form={form1}
						type={type}
						disabled={disabled}
						className={`text-white w-1/2 py-2 text-lg rounded-lg ${
							!disabled
								? "bg-black hover:bg-zinc-900 cursor-pointer"
								: "bg-zinc-400 cursor-not-allowed"
						}`}
					>
						Next
					</button>
				) : (
					<button
						form={form2}
						type={type}
						disabled={disabled}
						className={`text-white w-1/2 py-2 text-lg rounded-lg ${
							!disabled
								? "bg-black hover:bg-zinc-900 cursor-pointer"
								: "bg-zinc-400 cursor-not-allowed"
						}`}
					>
						Continue
					</button>
				)
			) : (
				<button
					onClick={onClick}
					className="text-white w-1/2 py-2 text-lg rounded-lg bg-black hover:bg-zinc-900 cursor-pointer"
				>
					Confirm
				</button>
			)}
		</>
	);
};

export default TxButtons;
