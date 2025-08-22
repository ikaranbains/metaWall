import { useEffect, useState } from "react";
import bcrypt from "bcryptjs";
import * as bip39 from "bip39";
import { Buffer } from "buffer";
import { addData } from "../../utils/idb";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../../context/WalletContext";
import Web3 from "web3";
import { useNetwork } from "../../context/NetworkContext";
import { registerValidation } from "../../utils/validation";
import { showRegistrationSuccess } from "../../utils/alerts";
import Input from "../common/Input";
import PasswordInput from "../common/PasswordInput";
import RecoveryPhraseGrid from "../common/RecoveryPhraseGrid";
import Steps from "../common/Steps";
import AuthCard from "../common/AuthCard";
import StepButtons from "../buttons/StepButtons";
import AuthForm from "../common/AuthForm";
import StepWrapper from "../common/StepWrapper";
import Cookies from "js-cookie";
import { chainConfigs } from "../../utils/constants";
window.Buffer = Buffer;

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
	const { setWallet } = useWallet();
	const { selectedOption } = useNetwork();

	const [recoveryPhrase] = useState(() => {
		const arr = generateMnemonic().split(" ");
		return arr ? arr : [];
	});
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

	const nextHandler = (e) => {
		e.preventDefault();

		//validation
		let errors = registerValidation(userDetails);
		// console.log(errors);
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

	const onBack = () => {
		setcurrentStep(1);
		setprogressWidth(0);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!selectedOption) console.log("No chain selected");
		const web3 = new Web3(selectedOption?.rpc || chainConfigs[0]?.rpc);
		const account = web3.eth.accounts.create();
		setWallet(account);
		localStorage.setItem("walletAddress", account?.address);
		Cookies.set("walletAddress", account?.address);

		const pass = await hashPassword(userDetails?.password);

		await addData({
			...userDetails,
			password: pass,
			recoveryPhrase: recoveryPhrase,
			userWallet: [
				{ account: account.address, privateKey: account.privateKey },
			],	
		});
		localStorage.setItem(`firstLogin_${userDetails?.email}`, "true");
		localStorage.setItem("chainId", chainConfigs[0]?.chainId);
		setuserDetails({
			id: "",
			firstname: "",
			email: "",
			password: "",
		});
		const res = await showRegistrationSuccess();
		setTimeout(() => {
			if (res.isConfirmed) navigate("/login");
		}, 100);
	};

	useEffect(() => {
		const token = localStorage.getItem("metaWallToken");
		if (token) return navigate("/home");
	}, []);

	return (
		<AuthCard>
			<Steps currentStep={currentStep} progressWidth={progressWidth} />

			<div className="flex gap-5 items-center w-[75%] justify-center">
				<StepWrapper active={currentStep === 1} step={1}>
					<AuthForm onSubmit={(e) => handleSubmit(e)} title="Register">
						<Input
							label="Name"
							required={true}
							type="text"
							placeholder="Enter Your Name..."
							name="firstname"
							onChange={(e) => handleChange(e)}
							value={userDetails?.firstname}
							error={formErrors}
						/>
						<Input
							label="Email"
							required={true}
							type="email"
							placeholder="Enter Your Email..."
							name="email"
							onChange={(e) => handleChange(e)}
							value={userDetails?.email}
							error={formErrors}
						/>

						<PasswordInput
							name="password"
							placeholder="Enter Your Password..."
							onChange={(e) => handleChange(e)}
							value={userDetails?.password}
							className={`outline-none rounded px-3 py-1.5 w-[90%]`}
							error={formErrors}
						/>
					</AuthForm>
				</StepWrapper>

				<StepWrapper active={currentStep === 2} step={2}>
					<h2 className="text-xl font-medium mt-5">Recovery Phrase</h2>
					{currentStep === 2 && (
						<>
							<RecoveryPhraseGrid
								hidePhrase={hidePhrase}
								onClick={() => sethidePhrase(false)}
								phraseInputs={recoveryPhrase}
								disabled={true}
							/>
							<p className="text-center mt-2">
								Please note down this recovery phrase and keep it safe as anyone
								with this phrase can access your wallet!!
							</p>
						</>
					)}
				</StepWrapper>
			</div>

			<StepButtons
				currentStep={currentStep}
				btnLabel="Ready to go!!"
				onBack={onBack}
				onNext={(e) => nextHandler(e)}
			/>
		</AuthCard>
	);
};

export default Register;
