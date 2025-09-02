import { PublicKey } from "@solana/web3.js";
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

export function isValidWalletAddress(address, type) {
	if (typeof address !== "string") return false;

	if (type === "evm") {
		// Quick regex sanity check (0x + 40 hex chars)
		const basicRegex = /^0x[a-fA-F0-9]{40}$/;
		if (!basicRegex.test(address)) return false;

		try {
			// ethers will throw if it's invalid
			const checksumAddress = getAddress(address);
			return (
				checksumAddress === address ||
				checksumAddress.toLowerCase() === address.toLowerCase()
			);
		} catch {
			return false;
		}
	}

	if (type === "sol") {
		try {
			// Will throw if not valid base58 or wrong length
			new PublicKey(address);
			return true; // valid solana address
		} catch {
			return false;
		}
	}

	return false;
}
