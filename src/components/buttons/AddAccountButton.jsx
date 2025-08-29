const AddAccountButton = ({ onCancel, onClick }) => {
	return (
		<div className="flex items-center gap-3 justify-center mt-8">
			<button
				onClick={onCancel}
				className="w-full py-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 cursor-pointer"
			>
				Cancel
			</button>
			<button
				onClick={onClick}
				className={`text-white w-full py-1.5 rounded-lg bg-black hover:bg-zinc-900 cursor-pointer`}
			>
				Add Account
			</button>
		</div>
	);
};

export default AddAccountButton;
