import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import bcrypt from "bcryptjs";
import * as bip39 from "bip39";
import { Buffer } from "buffer";
import { addData } from "../../utils/idb";
import { FaEyeSlash } from "react-icons/fa6";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import Label from "../common/Label";
window.Buffer = Buffer;

export const showRegistrationSuccess = () => {
	Swal.fire({
		title: "<strong>Registration Successful</strong>",
		html: "<p>Welcome aboard! You can now log in and start exploring.</p>",
		icon: "success",
		background: "#ffffff",
		iconColor: "#000000",
		confirmButtonText: "Continue",
		confirmButtonColor: "#000000",
		color: "#000000",
		customClass: {
			title: "text-xl font-semibold",
			htmlContainer: "text-base",
			popup: "rounded-lg shadow-lg",
			confirmButton: "px-6 py-2 rounded text-white",
		},
	});
};

export const generateMnemonic = () => {
	const mnemonic = bip39.generateMnemonic(); // 12-word default
	return mnemonic;
};

const Register = () => {
	const [userDetails, setuserDetails] = useState({
		id: nanoid(),
		firstname: "",
		email: "",
		password: "",
	});
	const navigate = useNavigate();

	const [recoveryPhrase, setrecoveryPhrase] = useState(() => {
		const arr = generateMnemonic().split(" ");
		return arr ? arr : [];
	});
	const [showRecoveryPhase, setshowRecoveryPhase] = useState(false);
	const [currentStep, setcurrentStep] = useState(1);
	const [progressWidth, setprogressWidth] = useState(0);
	const [hidePhrase, sethidePhrase] = useState(true);
	const [formErrors, setformErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;

		setuserDetails((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const hashPassword = async (password) => {
		const salt = bcrypt.genSaltSync(10);
		const hashedPass = await bcrypt
			.hash(password, salt)
			.then((result) => result);
		return hashedPass;
	};

	function validate(values) {
		let errors = {};
		let emailRegex = /^\S+@\S+\.\S+$/;

		//name
		if (!values.firstname || values.firstname === "") {
			errors.firstname = "Please enter your name!!";
		}

		//email
		if (!values.email || values.email === "") {
			errors.email = "Please enter your email!!";
		} else if (!emailRegex.test(values.email)) {
			errors.email = "Please enter valid email!!";
		}

		//password
		if (!values.password || values.password === "") {
			errors.password = "Please enter password!!";
		} else if (values.password.length < 6) {
			errors.password = "Password must be of 6 or more characters!!";
		}

		return errors;
	}

	const nextHandler = (e) => {
		e.preventDefault();

		//validation
		let errors = validate(userDetails);
		console.log(errors);
		setformErrors(errors);
		let length = Object.keys(errors).length;
		if (length > 0) {
			return;
		}

		setcurrentStep(2);
		sethidePhrase(true);
		setprogressWidth(75);
		e.stopPropagation();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const pass = await hashPassword(userDetails?.password);
		await addData({
			...userDetails,
			password: pass,
			recoveryPhrase: recoveryPhrase,
		});
		showRegistrationSuccess();
		setuserDetails({
			id: "",
			firstname: "",
			email: "",
			password: "",
		});
		setTimeout(() => {
			navigate("/login");
		}, 1000);
	};

	return (
		<div className="min-h-full w-full flex items-center py-20 flex-col">
			<h1 className="text-3xl font-semibold">MetaWall - Secure Web3 wallet</h1>

			<div className="mt-25 py-10 shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] w-[35vw] min-h-80 p-4 flex items-center justify-center flex-col gap-3 rounded overflow-hidden">
				<div className="flex relative w-[50%] items-center justify-between px-8 mt-3">
					<div
						className={`absolute z-10 bg-black ml-2 h-1.5 transition-all ease-in-out duration-300`}
						style={{ width: `${progressWidth}%` }}
					></div>
					<div className="absolute bg-zinc-400 w-[75%] ml-2 h-1.5"></div>
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

				<div className="flex gap-5 items-center w-[75%] justify-center">
					<div
						className={`min-h-60 w-full flex flex-col items-center shrink-0 ${
							currentStep === 1 ? "translate-x-60 shrink-0" : "-translate-x-80"
						} transition-all ease-in-out duration-200`}
					>
						<h2 className="font-medium text-xl pt-4">Register</h2>
						<form
							noValidate
							onSubmit={(e) => handleSubmit(e)}
							className="h-full flex flex-col shrink-0 gap-3 items-center py-10"
							id="userForm"
						>
							<div className="flex flex-col ">
								<Label htmlFor="firstname" content="Name" required />
								<input
									type="text"
									placeholder="Enter Your Name..."
									name="firstname"
									onChange={(e) => handleChange(e)}
									value={userDetails?.firstname}
									className={`outline-none ${
										formErrors?.firstname
											? "border border-red-500"
											: "border border-zinc-400"
									} rounded px-3 py-1.5 mt-2 w-[20vw]`}
								/>
								{formErrors && formErrors.firstname && (
									<p className="text-sm text-red-500 mt-1">
										{formErrors.firstname}
									</p>
								)}
							</div>

							<div className="flex flex-col ">
								<Label htmlFor="email" content="Email" required />
								<input
									type="email"
									placeholder="Enter Your Email..."
									name="email"
									onChange={(e) => handleChange(e)}
									value={userDetails?.email}
									className={`outline-none ${
										formErrors?.firstname
											? "border border-red-500"
											: "border border-zinc-400"
									} rounded px-3 py-1.5 mt-2 w-[20vw]`}
								/>
								{formErrors && formErrors.email && (
									<p className="text-sm text-red-500 mt-1">
										{formErrors.email}
									</p>
								)}
							</div>

							<div className="flex flex-col ">
								<Label htmlFor="password" content="Password" required />
								<input
									type="password"
									placeholder="Enter Your Password..."
									name="password"
									onChange={(e) => handleChange(e)}
									value={userDetails?.password}
									className={`outline-none ${
										formErrors?.firstname
											? "border border-red-500"
											: "border border-zinc-400"
									} rounded px-3 py-1.5 mt-2 w-[20vw]`}
								/>
								{formErrors && formErrors.password && (
									<p className="text-sm text-red-500 mt-1">
										{formErrors.password}
									</p>
								)}
							</div>
						</form>
					</div>

					<div
						className={`w-full min-h-60 flex flex-col mb-18 items-center gap-3 shrink-0 ${
							currentStep === 2 ? "-translate-x-60" : "translate-x-100 "
						} transition-all ease-in-out duration-200`}
					>
						<h2 className="text-xl font-medium mt-5">Recovery Phrase</h2>
						{currentStep === 2 && (
							<>
								<div
									onClick={() => sethidePhrase(false)}
									className="w-full h-full border rounded border-zinc-500 relative"
								>
									{hidePhrase && (
										<div className="text-zinc-500 absolute z-[999] w-full h-full flex flex-col items-center justify-center">
											<FaEyeSlash size={25} />
											<p
												onClick={() => sethidePhrase(false)}
												className="mt-1 cursor-pointer"
											>
												Click to view
											</p>
										</div>
									)}
									<div
										className={`grid ${
											hidePhrase ? "blur-sm" : "blur-none"
										} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full h-full p-5`}
									>
										{recoveryPhrase &&
											recoveryPhrase.map((phrase, idx) => (
												<div key={idx} className="flex items-center gap-2">
													<label className="text-sm w-5 text-right">
														{idx + 1}.
													</label>
													<input
														value={phrase}
														className="flex-1 border rounded border-zinc-500 px-3 py-1 bg-white w-25"
														disabled
													/>
												</div>
											))}
									</div>
								</div>
								<p className="text-center mt-2">
									Please note down this recovery phrase and keep it safe as
									anyone with this phrase can access your wallet!!
								</p>
							</>
						)}
					</div>
				</div>

				{currentStep === 1 ? (
					<button
						onClick={(e) => nextHandler(e)}
						type="button"
						className="group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-neutral-950 font-medium text-neutral-200 transition-all duration-300 hover:w-32 mt-5 cursor-pointer"
					>
						<div className="inline-flex whitespace-nowrap opacity-0 transition-all duration-200 group-hover:-translate-x-3 group-hover:opacity-100">
							Next
						</div>
						<div className="absolute right-3.5">
							<svg
								width="15"
								height="15"
								viewBox="0 0 15 15"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
							>
								<path
									d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
									fill="currentColor"
									fillRule="evenodd"
									clipRule="evenodd"
								></path>
							</svg>
						</div>
					</button>
				) : (
					<div className="flex items-center gap-5 justify-center">
						<button
							onClick={() => {
								setcurrentStep(1);
								setprogressWidth(0);
							}}
							className=" cursor-pointer group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-neutral-950 font-medium text-neutral-200"
						>
							<div className="translate-x-0 transition group-hover:-translate-x-[300%]">
								<svg
									width="15"
									height="15"
									viewBox="0 0 15 15"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
								>
									<path
										d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
										fill="currentColor"
										fillRule="evenodd"
										clipRule="evenodd"
									></path>
								</svg>
							</div>
							<div className="absolute translate-x-[300%] transition group-hover:translate-x-0">
								<svg
									width="15"
									height="15"
									viewBox="0 0 15 15"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
								>
									<path
										d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
										fill="currentColor"
										fillRule="evenodd"
										clipRule="evenodd"
									></path>
								</svg>
							</div>
						</button>
						<button
							form="userForm"
							type="submit"
							className="cursor-pointer group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 transition hover:scale-110"
						>
							<span>Ready to go!!</span>
							<div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
								<div className="relative h-full w-8 bg-white/20"></div>
							</div>
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Register;
