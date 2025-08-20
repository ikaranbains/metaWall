import { useState } from "react";
import Label from "./Label";
import { LuEye, LuEyeOff } from "react-icons/lu";

const PasswordInput = ({
	name,
	placeholder = "",
	onChange = () => {},
	value,
	divClass,
	className,
	error = {},
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="flex flex-col">
			<Label htmlFor={name} content="Password" required={true} />
			<div
				className={`w-[20vw]  ${
					error["password"] ? "border-red-500" : "border-zinc-400"
				} border outline-none rounded flex items-center mt-2 ${divClass}`}
			>
				<input
					name={name}
					type={showPassword ? "text" : "password"}
					placeholder={placeholder}
					onChange={onChange}
					value={value}
					className={`outline-none rounded px-3 py-1.5 w-[90%] ${className}`}
					{...props}
				/>
				<span
					onClick={() => setShowPassword((prev) => !prev)}
					className="ml-2 cursor-pointer"
				>
					{!showPassword ? <LuEye size={22} /> : <LuEyeOff size={22} />}
				</span>
			</div>
			{error && error["password"] && (
				<p className="text-sm text-red-500 mt-1">{error["password"]}</p>
			)}
		</div>
	);
};

export default PasswordInput;
