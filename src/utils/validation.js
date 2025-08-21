import { getAddress } from "ethers";

export const registerValidation = (values) => {
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
};

export const loginValidation = (values) => {
	let errors = {};
	let emailRegex = /^\S+@\S+\.\S+$/;

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
};

export function isValidWalletAddress(address) {
	if (typeof address !== "string") return false;

	// Quick regex sanity check
	const basicRegex = /^0x[a-fA-F0-9]{40}$/;
	if (!basicRegex.test(address)) return false;

	try {
		// ethers v6 getAddress will checksum & validate
		const checksumAddress = getAddress(address);
		return (
			checksumAddress === address ||
			checksumAddress.toLowerCase() === address.toLowerCase()
		);
	} catch {
		return false;
	}
}
