import React, { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { getDataById } from "../utils/idb";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import toast from "react-hot-toast";
import { IoIosArrowDown } from "react-icons/io";
import NetworkSelector from "./NetworkSelector";
import { IoIosMenu } from "react-icons/io";
import { GoArrowUpRight } from "react-icons/go";
import { MdOutlineQrCodeScanner } from "react-icons/md";

const Home = () => {
	const [userData, setUserData] = useState({});
	const { wallet } = useWallet();
	const [address, setAddress] = useState("");
	const [copy, setCopy] = useState(false);

	const getUser = async (id) => {
		if (id) {
			const user = await getDataById(id);
			setUserData(user);
			setAddress(user.userWallet[0].account);
		}
	};

	const copyHandler = () => {
		setCopy(true);
		navigator.clipboard
			.writeText(address)
			.then(() => {
				console.log("copied");
				toast.success("Copied to Clipboard", {
					className: "relative top-0 z-[9999	]",
				});
			})
			.catch((err) => console.log("error", err));
		setTimeout(() => setCopy(false), 2000);
	};

	function randomPastelColor() {
		const hue = Math.floor(Math.random() * 360);
		return `hsl(${hue}, 70%, 60%)`; // pastel-like, a bit richer saturation
	}

	const RandomPieIcon = ({ size = 50, slices = 3 }) => {
		// Generate random slice sizes (angles)
		let remaining = 100;
		let percents = [];
		for (let i = 0; i < slices; i++) {
			if (i === slices - 1) {
				percents.push(remaining);
			} else {
				const part = Math.floor(Math.random() * (remaining - (slices - i))) + 1;
				percents.push(part);
				remaining -= part;
			}
		}

		// Create cumulative angles
		let cumulative = 0;
		const paths = percents.map((percent) => {
			const [startX, startY] = getCoordinatesForPercent(cumulative / 100);
			cumulative += percent;
			const [endX, endY] = getCoordinatesForPercent(cumulative / 100);

			const largeArcFlag = percent > 50 ? 1 : 0;
			const pathData = [
				`M ${50} ${50}`, // Move to center
				`L ${startX} ${startY}`, // Line to start
				`A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
				"Z", // Close
			].join(" ");

			return {
				d: pathData,
				color: randomPastelColor(),
			};
		});

		return (
			<svg width={size} height={size} viewBox="0 0 100 100">
				{paths.map((slice, i) => (
					<path
						key={i}
						d={slice.d}
						fill={slice.color}
						stroke="white"
						strokeWidth="0.5"
					/>
				))}
			</svg>
		);
	};

	// Helper: convert percentage into X/Y on a circle
	function getCoordinatesForPercent(percent) {
		const x = 50 + 50 * Math.cos(2 * Math.PI * percent - Math.PI / 2);
		const y = 50 + 50 * Math.sin(2 * Math.PI * percent - Math.PI / 2);
		return [x, y];
	}

	useEffect(() => {
		const userId = localStorage.getItem("loggedUserId");
		getUser(userId);
	}, []);

	// console.log("userData ------------------------", userData.userWallet);
	return (
		<div className="w-full h-screen overflow-x-hidden">
			<div className="w-full h-screen bg-[#f3f5f9] absolute"></div>
			<div className="absolute w-full z-[99]">
				<h2 className="font-bold text-xl text-center mt-10 leading-none">meta</h2>
				<h1 className="font-bold text-3xl text-center">Wall</h1>
				<div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white mt-8 w-[65%] m-auto min-h-[85vh] flex items-center flex-col">
					<div className="w-full h-20 flex items-center justify-between px-10 border-b border-zinc-200">
						<div>
							<NetworkSelector />
						</div>
						<div className="flex items-center flex-col gap-2 justify-center mr-45">
							<div className="flex items-center justify-center gap-3 hover:bg-zinc-200 px-2 py-0.5 rounded cursor-pointer">
								<div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
									{Array.from({ length: 1 }).map((_, i) => (
										<RandomPieIcon
											key={i}
											size={18}
											slices={Math.floor(Math.random() * 4) + 2}
										/>
									))}
								</div>{" "}
								<h2>Account 1</h2>
								<span className="">
									<IoIosArrowDown size={13} />
								</span>
							</div>
							<h2 className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
								{address
									? `${address.slice(0, 6)}...${address.slice(-7)}`
									: "not found"}
								<span onClick={copyHandler} className="cursor-pointer">
									{copy ? <LuCopyCheck size={17} /> : <LuCopy size={17} />}
								</span>
							</h2>
						</div>
						<div>
							<IoIosMenu size={20} />
						</div>
					</div>
					<div className="w-full h-60 flex flex-col items-center pt-10">
						<h2 className="text-[2.1vw]">$0.00 USD</h2>
						<div className="pt-7 flex items-center justify-center gap-10">
							<div className="flex items-center justify-center flex-col">
								<span className="w-10 h-10 inline-flex rounded-full items-center justify-center bg-zinc-300">
									<GoArrowUpRight />
								</span>
								Send
							</div>
							<div className="flex items-center justify-center flex-col">
								<span className="w-10 h-10 inline-flex rounded-full items-center justify-center bg-zinc-300">
									<MdOutlineQrCodeScanner />
								</span>
								Receive
							</div>
						</div>
					</div>
					<div className="w-full flex items-center justify-between px-10 pt-3">
						<h3 className="text-xl">tokens</h3>
						<h3 className="text-xl">activity</h3>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
