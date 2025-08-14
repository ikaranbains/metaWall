import React from "react";

const Home = () => {
	return (
		<div className="w-full h-screen overflow-x-hidden">
			<div className="w-full h-screen bg-[#f3f5f9] absolute z-[10]"></div>
			<div className="absolute w-full z-[9999]">
				<h2 className="font-bold text-xl text-center mt-10">meta</h2>
				<h1 className="font-bold text-3xl text-center">Wall</h1>
				<div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white mt-10 w-[75%] m-auto min-h-[85vh] border flex items-center flex-col">
					<div className="w-full border border-red-400 h-20 flex items-center justify-between px-10">
						<h2>chain</h2>
						<div className="flex items-center flex-col gap-2 justify-center">
							<h2>acc1</h2>
							<h2>0x35434...2345243</h2>
						</div>
						<h2>menu</h2>
					</div>
					<div className="border border-yellow-400 w-full h-60 flex flex-col items-center pt-10 gap-3">
						<h2>$balance USD</h2>
						<div className="pt-10 flex items-center justify-center gap-10">
							<h2>send</h2>
							<h2>receive</h2>
						</div>
					</div>
					<div className="border border-blue-400 w-full flex items-center justify-between px-10 pt-3">
						<h3 className="text-xl">tokens</h3>
						<h3 className="text-xl">activity</h3>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
