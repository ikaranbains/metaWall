import React from "react";

const Label = ({
	children,
	htmlFor = "",
	content = "",
	className = "",
	required = false,
	...props
}) => {
	return (
		<label htmlFor={htmlFor} className={`${className} flex gap-1`} {...props}>
			{children ? (
				children
			) : (
				<>
					{content}
					{required && <p className="text-red-500">*</p>}
				</>
			)}
		</label>
	);
};

export default Label;
