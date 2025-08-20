import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

// Note: step 1 - create api client (base url)
const apiClient = axios.create({
	baseURL: import.meta.env.VITE_ETHERSCAN_API,
	timeout: 30000,
});

// Note: step 2 - create request interceptor
apiClient.interceptors.request.use(
	(body) => {
		const token =
			localStorage.getItem("metaWallToken") || Cookies.get("metaWallToken");

		if (token && !body.baseURL.includes("etherscan")) {
			body.headers.Authorization = `Bearer ${token}`;
		}

		// check if data is formdata object instance
		const isFormData = body.data instanceof FormData;
		if (!isFormData) {
			body.headers["Content-Type"] = "application/json";
		}

		return body;
	},

	(err) => {
		console.error("API Request Error: ", err);
		return Promise.reject(err);
	}
);

// Note: step 3 - create response interceptor
apiClient.interceptors.response.use(
	(res) => {
		return { httpStatus: res.status, ...res.data };
	},
	(err) => {
		const message =
			err.res.data.message ||
			err.res.data.error ||
			err.message ||
			"Something went wrong";

		// check if error is really an axios error
		if (axios.isAxiosError(err)) {
			console.log("An Axios Error: ", err);

			if (err.response.status === 401) {
				toast.error("Your session has expired!!", {
					id: "sessionExpiredToast",
				});
				Cookies.remove("metaWallToken");
				localStorage.clear();
				window.location.pathname = "/login";
			} else {
				toast.error(message, { id: "errorMessageToast" });
			}
		}

		console.error("Api Error", message);
		return Promise.reject(err);
	}
);

// Note: step 4 - create generic fn for api calls
export const apiCall = async ({
	method,
	url,
	data = null,
	params = null,
	headers = {},
}) => {
	if (!url) {
		console.warn("Api call missing URL");
		return { success: false, message: "Missing URL" };
	}
	if (!method) {
		console.warn("Api call missing Method");
		return { success: false, message: "Missing Method" };
	}

	// check if formdata or not
	const isFormData = data instanceof FormData;
	try {
		const response = await apiClient({
			method: method.toLowerCase(),
			url,
			data,
			params,
			headers: {
				...(!isFormData && { "Content-Type": "application/json" }),
				...headers,
			},
		});

		return {
			success: true,
			data: response?.data ?? response,
			status: response.status ?? 200,
		};
	} catch (err) {
		const message = "Something went wrong";
		toast.error(message, { id: "apiErrorToast" });
		console.error(`API Error [${method} ${url}]: `, message);

		return {
			success: false,
			message,
			status: err.status || 500,
		};
	}
};

export default apiClient;
