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
