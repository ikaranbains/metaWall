const NewAccountNameInput = ({ value, onChange, name, placeholder }) => {
	return (
		<>
			<p className="text-lg mt-3 ml-1">Account Name</p>
			<input
				value={value}
				onChange={onChange}
				type="text"
				placeholder={placeholder}
				name={name}
				className="border border-gray-400 w-full rounded-lg px-3 py-2 focus:border-black mt-3"
			/>
		</>
	);
};

export default NewAccountNameInput;
