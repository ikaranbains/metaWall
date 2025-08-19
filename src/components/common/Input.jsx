import Label from "./Label";

const Input = ({
	name,
	label,
	required = false,
	type = "text",
	placeholder = "",
	onChange = () => {},
	className,
	value,
	error = {},
	...props
}) => {
	return (
		<div className="flex flex-col ">
			<Label htmlFor={name} content={label} required={required} />
			<input
				name={name}
				value={value}
				placeholder={placeholder}
				type={type}
				onChange={onChange}
				className={`outline-none ${
					error[name] ? "border border-red-500" : "border border-zinc-400"
				} rounded px-3 py-1.5 mt-2 w-[20vw] ${className}`}
				{...props}
			/>
			{error && error[name] && (
				<p className="text-sm text-red-500 mt-1">{error[name]}</p>
			)}
		</div>
	);
};

export default Input;
