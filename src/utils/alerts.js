import Swal from "sweetalert2";

export const showRegistrationSuccess = () => {
	return Swal.fire({
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

export const showUserNotFoundError = () => {
	Swal.fire({
		title: "<strong>User Not Found</strong>",
		html: "<p>Invalid Username!!</p>",
		icon: "error",
		background: "#ffffff",
		iconColor: "#ff0000",
		confirmButtonText: "Register",
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

export const showInvalidPasswordError = () => {
	Swal.fire({
		title: "<strong>Invalid Password</strong>",
		html: "<p>The password you entered is incorrect. Please try again.</p>",
		icon: "error",
		background: "#ffffff",
		iconColor: "#ff0000",
		confirmButtonText: "Try Again",
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

export const showLoginSuccessful = () => {
	return Swal.fire({
		title: "<strong>Login Successful</strong>",
		html: "<p>Welcome! You’ve successfully logged in.</p>",
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
