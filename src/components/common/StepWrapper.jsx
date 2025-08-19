const StepWrapper = ({ children, active, step }) => {
	if (step === 1) {
		return (
			<div
				className={`min-h-60 w-full flex flex-col items-center shrink-0 ${
					active ? "translate-x-60" : "-translate-x-80"
				} transition-all ease-in-out duration-200`}
			>
				{children}
			</div>
		);
	}

	if (step === 2) {
		return (
			<div
				className={`w-full min-h-60 flex flex-col mb-18 items-center gap-3 shrink-0 ${
					active ? "-translate-x-60" : "translate-x-100 "
				} transition-all ease-in-out duration-200`}
			>
				{children}
			</div>
		);
	}

	return <>{children}</>;
};

export default StepWrapper;
