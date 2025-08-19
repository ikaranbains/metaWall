import React from "react";
import { FaEyeSlash } from "react-icons/fa6";

const RecoveryPhraseGrid = ({
	hidePhrase = false,
	onClick = () => {},
	phraseInputs = [],
	disabled = false,
	onChange = () => {},
}) => {
	return (
		<div
			onClick={onClick}
			className="w-full h-full border rounded border-zinc-500 relative"
		>
			{hidePhrase && (
				<div className="text-zinc-500 absolute z-[999] w-full h-full flex flex-col items-center justify-center">
					<FaEyeSlash size={25} />
					<p onClick={onClick} className="mt-1 cursor-pointer">
						Click to view
					</p>
				</div>
			)}
			<div
				className={`grid ${
					hidePhrase ? "blur-sm" : "blur-none"
				} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full h-full p-5`}
			>
				{phraseInputs &&
					phraseInputs.map((phraseInput, idx) => (
						<div key={idx} className="flex items-center gap-2">
							<label className="text-sm w-5 text-right">{idx + 1}.</label>
							<input
								value={phraseInput || ""}
								name={idx}
								className="flex-1 border rounded border-zinc-500 px-3 py-1 bg-white w-25"
								onChange={onChange}
								disabled={disabled}
							/>
						</div>
					))}
			</div>
		</div>
	);
};

export default RecoveryPhraseGrid;
