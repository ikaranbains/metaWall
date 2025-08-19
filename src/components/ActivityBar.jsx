import { useState } from "react";

const ActivityBar = () => {
    const [panelSelected, setPanelSelected] = useState(1);


	return (
		<div className="w-full flex items-center flex-col px-10 py-3">
			<div className="w-full flex items-center justify-between">
				<div className="relative flex w-full">
					{/* Sliding underline */}
					<div
						className={`absolute bottom-0 h-0.5 bg-black transition-transform duration-300 ease-in-out`}
						style={{
							width: "50%", // since you have 2 tabs
							transform:
								panelSelected === 1 ? "translateX(0%)" : "translateX(100%)",
						}}
					></div>

					<div
						onClick={() => setPanelSelected(1)}
						className="w-1/2 flex items-center justify-center py-2 cursor-pointer border-b-2 border-zinc-300"
					>
						<h2
							className={`text-lg transition-colors duration-200 ${
								panelSelected === 1 ? "text-black" : "text-zinc-400"
							} hover:text-black`}
						>
							Tokens
						</h2>
					</div>

					<div
						onClick={() => setPanelSelected(2)}
						className="w-1/2 flex items-center justify-center py-2 cursor-pointer border-b-2 border-zinc-300"
					>
						<h2
							className={`text-lg transition-colors duration-200 ${
								panelSelected === 2 ? "text-black" : "text-zinc-400"
							} hover:text-black`}
						>
							Activity
						</h2>
					</div>
				</div>
			</div>

			<div className="flex items-center w-full h-full mt-5">
				<div className={`w-full ${panelSelected === 1 ? "block" : "hidden"} `}>
					tokens
				</div>
				<div className={`w-full ${panelSelected === 2 ? "block" : "hidden"} `}>
					activity
				</div>
			</div>
		</div>
	);
};

export default ActivityBar;
