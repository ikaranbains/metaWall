import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { getDataByEmail, updateData } from "../../utils/idb";
import toast from "react-hot-toast";
import { loginValidation } from "../../utils/validation";
import {
	showInvalidPasswordError,
	showLoginSuccessful,
	showUserNotFoundError,
} from "../../utils/alerts";
import RecoveryPhraseGrid from "../common/RecoveryPhraseGrid";
import Input from "../common/Input";
import PasswordInput from "../common/PasswordInput";
import Steps from "../common/Steps";
import AuthCard from "../common/AuthCard";
import StepButtons from "../buttons/StepButtons";
import AuthForm from "../common/AuthForm";
import StepWrapper from "../common/StepWrapper";
import Cookies from "js-cookie";
import RecoveryModal from "../RecoveryModal";
import { evmConfigs } from "../../utils/constants";

const Login = () => {
	const [loginDetails, setloginDetails] = useState({
		email: "",
		password: "",
	});
	const navigate = useNavigate();
	const [userData, setuserData] = useState({});
	const [recoveryPhrase, setrecoveryPhrase] = useState(new Array(12).fill(""));
	const [currentStep, setcurrentStep] = useState(1);
	const [progressWidth, setprogressWidth] = useState(0);
	const [loginErrors, setloginErrors] = useState({});
	const [userFound, setuserFound] = useState(false);
	const [showRecoveryPopup, setShowRecoveryPopup] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;

		setloginDetails((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const nextHandler = async (e) => {
		e.preventDefault();
		//validation
		let errors = loginValidation(loginDetails);
		// console.log(errors);
		setloginErrors(errors);
		let length = Object.keys(errors).length;
		if (length > 0) {
			return;
		}

		// check login details
		const { email, password } = loginDetails ?? loginDetails;
		const user = await getDataByEmail(email);
		// console.log(user);
		if (!user) {
			setuserFound(false);
			return showUserNotFoundError();
		} else {
			setuserFound(true);
		}

		const isMatch = await bcrypt.compare(password, user?.password);

		if (!isMatch) return showInvalidPasswordError();

		const isFirstLogin = localStorage.getItem(`firstLogin_${email}`) === "true";

		setuserData(user);
		const token = crypto.randomUUID();
		localStorage.setItem("metaWallToken", token);
		Cookies.set("metaWallToken", token);

		if (isFirstLogin) {
			// Show recovery phrase
			setcurrentStep(2);
			setprogressWidth(75);
		} else {
			// Skip to final login
			handleFinalLogin(user);
		}

		// console.log(user);

		e.stopPropagation();
	};

	const onBack = () => {
		setcurrentStep(1);
		setprogressWidth(0);
	};

	const secretChangeHandler = (e) => {
		const { name, value } = e.target;
		setrecoveryPhrase((prev) => {
			const copy = [...prev];
			copy[name] = value;
			return copy;
		});
	};

	const handleFinalLogin = async (user) => {
		setloginDetails({ email: "", password: "" });

		// console.log("user-------------", user);
		localStorage.setItem("loggedUserId", user?.id);
		localStorage.setItem("chainId", evmConfigs[0]?.chainId);
		// await updateData
		// console.log("user ------------",user)

		const updatedWallet = user?.userWallet.map((w, i) => {
			if (i === 0) {
				return { ...w, name: w.name || "Account 1", type: "evm" };
			}

			return w;
		});

		await updateData({ userWallet: updatedWallet }, user?.id);

		localStorage.setItem(
			"selectedAccount",
			JSON.stringify({
				name: user?.userWallet[0]?.name,
				address: user?.userWallet[0]?.account,
				type: user?.userWallet[0]?.type,
			})
		);

		// Mark first login as completed
		localStorage.setItem(`firstLogin_${loginDetails?.email}`, "false");

		const res = await showLoginSuccessful();

		setTimeout(() => {
			if (res.isConfirmed) navigate("/home");
		}, 100);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const arr = Object.values(recoveryPhrase);
		const storedPhrase = userData?.recoveryPhrase;
		const checkPhrase = storedPhrase.every((elem, idx) => elem === arr[idx]);

		if (!checkPhrase) {
			toast.error("Recovery Phrase in wrong, please enter correct phrase!!");
			return;
		}

		handleFinalLogin(userData);
	};

	return (
		<>
			{showRecoveryPopup && (
				<div className="absolute w-full h-full backdrop-blur-md z-[999]">
					<RecoveryModal onClose={() => setShowRecoveryPopup(false)} />
				</div>
			)}
			<AuthCard>
				<Steps currentStep={currentStep} progressWidth={progressWidth} />

				<div className="flex gap-5 items-center w-[75%] justify-center">
					<StepWrapper active={currentStep === 1} step={1}>
						<AuthForm onSubmit={(e) => handleSubmit(e)} title="Login">
							<Input
								name="email"
								label="Email"
								required={true}
								type="email"
								placeholder="Enter Your Email..."
								onChange={(e) => handleChange(e)}
								value={loginDetails?.email}
								error={loginErrors}
							/>
							<PasswordInput
								name="password"
								placeholder="Enter Your Password..."
								onChange={(e) => handleChange(e)}
								value={loginDetails?.password}
								error={loginErrors}
							/>
						</AuthForm>
						{!userFound && (
							<div
								onClick={() => setShowRecoveryPopup(true)}
								className="text-sm hover:underline hover:text-blue-500 cursor-pointer"
							>
								Recover Wallet
							</div>
						)}
					</StepWrapper>

					<StepWrapper active={currentStep === 2} step={2}>
						<h2 className="text-xl text-center font-medium mt-5">
							Enter Secret Recovery Phrase for Authentication
						</h2>
						{currentStep === 2 && (
							<>
								<RecoveryPhraseGrid
									phraseInputs={recoveryPhrase}
									onChange={secretChangeHandler}
								/>
							</>
						)}
					</StepWrapper>
				</div>

				<StepButtons
					currentStep={currentStep}
					btnLabel="Login"
					onBack={onBack}
					onNext={(e) => nextHandler(e)}
				/>
			</AuthCard>
		</>
	);
};

export default Login;
