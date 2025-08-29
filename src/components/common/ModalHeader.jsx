import { IoIosArrowBack, IoIosClose } from "react-icons/io";

const ModalHeader = ({
	title,
	onClose,
	accStep2,
	setAccStep2,
	accStep3,
	setAccStep3,
}) => {
	return (
		<div className="relative w-full mt-2 pr-2 flex items-center justify-between	">
			{!accStep2 ? (
				""
			) : accStep3 ? (
				<IoIosArrowBack
					onClick={() => {
						setAccStep2(true);
						setAccStep3(false);
					}}
					className="ml-3 cursor-pointer"
				/>
			) : (
				<IoIosArrowBack
					onClick={() => setAccStep2(false)}
					className="ml-3 cursor-pointer"
				/>
			)}
			<h2 className="absolute left-1/2 -translate-x-1/2 font-semibold text-lg">
				{title}
			</h2>
			<span
				onClick={onClose}
				className="ml-auto cursor-pointer hover:text-red-500 transition"
			>
				<IoIosClose size={22} />
			</span>
		</div>
	);
};

export default ModalHeader;
