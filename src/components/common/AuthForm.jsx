import React from "react";

const AuthForm = ({ children, onSubmit = () => {}, title }) => {
	return (
		<>
			<h2 className="font-medium text-xl pt-4">{title}</h2>
			<form
				noValidate
				onSubmit={onSubmit}
				className="h-full flex flex-col shrink-0 gap-3 items-center py-10"
				id="userForm"
			>
				{children}
			</form>
		</>
	);
};

export default AuthForm;
