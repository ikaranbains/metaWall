import { useState } from "react";
import bcrypt from "bcryptjs";
import * as bip39 from "bip39";
// import hdkey from "hdkey";
// import { ethers } from "ethers";
import { nanoid } from "nanoid";
// import { addData } from "../../utils/idb";
import toast from "react-hot-toast";
import RecoveryPhraseGrid from "./common/RecoveryPhraseGrid";
import AuthForm from "./common/AuthForm";
import Input from "./common/Input";
import PasswordInput from "./common/PasswordInput";
import ShineBtn from "./common/ShineBtn";
import Label from "./common/Label";

const RecoveryModal = ({ onClose }) => {
	const [recoveryDetails, setRecoveryDetails] = useState({
		id: nanoid(),
		email: "",
		password: "",
	});
	const [phrase, setPhrase] = useState(new Array(12).fill(""));

	const handleChange = (e) => {
		let { name, value } = e.target;
		setRecoveryDetails((prev) => ({ ...prev, [name]: value }));
	};

	// const handleSubmit = async (e) => {
	// 	e.preventDefault();
	// 	try {
	// 		// Join words back into string
	// 		const mnemonic = phrase.join(" ").trim();

	// 		if (!bip39.validateMnemonic(mnemonic)) {
	// 			toast.error("Invalid recovery phrase!");
	// 			return;
	// 		}

	// 		// Derive wallet from phrase
	// 		const seed = await bip39.mnemonicToSeed(mnemonic);
	// 		const hdwallet = hdkey.fromMasterSeed(seed);
	// 		const path = "m/44'/60'/0'/0/0";
	// 		const derived = hdwallet.derive(path);
	// 		const wallet = new ethers.Wallet(derived.privateKey);

	// 		// Hash password
	// 		const hashedPass = await bcrypt.hash(password, 10);

	// 		// Build new user object
	// 		const newUser = {
	// 			id: nanoid(),
	// 			firstname: "",
	// 			email,
	// 			password: hashedPass,
	// 			recoveryPhrase: phrase,
	// 			userWallet: [
	// 				{ account: wallet.address, privateKey: wallet.privateKey },
	// 			],
	// 		};

	// 		await addData(newUser);

	// 		// Also set tokens so dashboard works
	// 		const token = crypto.randomUUID();
	// 		localStorage.setItem("metaWallToken", token);
	// 		localStorage.setItem("loggedUserId", newUser.id);

	// 		toast.success("Wallet recovered successfully ✅");
	// 		onClose();
	// 		window.location.href = "/home"; // or navigate
	// 	} catch (err) {
	// 		console.error(err);
	// 		toast.error("Recovery failed!");
	// 	}
	// };

	return (
		<div className="overflow-hidden w-full h-screen flex items-center justify-center">
			<div className="flex items-center justify-center flex-col shadow-[0_3px_10px_rgb(0,0,0,0.2)] w-[35vw] min-h-100 bg-white rounded-lg pt-4">
				{/* <h2 className="text-xl mb-5 font-medium">Recover Wallet</h2> */}
				<AuthForm title="Recover Wallet">
					<Input
						label="Email"
						type="email"
						name="email"
						placeholder="Email"
						value={recoveryDetails?.email}
						onChange={(e) => handleChange(e)}
						required={true}
						className="w-[24.5vw]"
					/>
					<PasswordInput
						name="password"
						placeholder="New password"
						value={recoveryDetails?.password}
						onChange={(e) => handleChange(e)}
						divClass="w-[24.5vw]"
					/>
					<div className="mt-5">
						<Label
							htmlFor="recoveryPhrase"
							content="Secret Phrase"
							className="mb-2"
							required
						/>
						<RecoveryPhraseGrid
							phraseInputs={phrase}
							onChange={(e, idx) => {
								const copy = [...phrase];
								copy[idx] = e.target.value;
								setPhrase(copy);
							}}
						/>
					</div>

					<div className="flex items-center justify-center gap-6 mt-5">
						<button
							onClick={onClose}
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
										d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
										fill="currentColor"
										fillRule="evenodd"
										clipRule="evenodd"
									/>
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
										d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
										fill="currentColor"
										fillRule="evenodd"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						</button>
						<ShineBtn btnLabel="Recover" />
					</div>
				</AuthForm>
			</div>
		</div>
	);
};

export default RecoveryModal;
