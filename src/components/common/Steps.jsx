import React from "react";

const Steps = ({ currentStep, progressWidth }) => {
	return (
		<div className="flex relative w-[47%] items-center justify-between px-8 mt-3">
			<div
				className={`absolute z-10 bg-black ml-2 h-1.5 transition-all ease-in-out duration-300`}
				style={{ width: `${progressWidth}%` }}
			></div>
			<div className="absolute bg-zinc-400 sm:w-[65%] md:max-w-[70%] max-w-[55%] ml-2 h-1.5"></div>
			<div className="relative z-99 circle w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center border-3 border-black">
				1
			</div>
			<div
				className={`relative z-99 circle w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center border-3 ${
					currentStep === 2 ? "border-black" : "border-zinc-400"
				} transition-all duration-500 `}
			>
				2
			</div>
		</div>
	);
};

export default Steps;
