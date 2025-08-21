import { useEffect, useState } from "react";
import { getDataById } from "../utils/idb";

const useUser = () => {
	const [userData, setUserData] = useState(null);
	const id = localStorage.getItem("loggedUserId");
	if (!id) return { error: "id not found" };
	useEffect(() => {
		const getUser = async (id) => {
			const user = await getDataById(id);
			setUserData(user);
		};

		if (id && !userData) getUser(id);
	}, []);

	return { userData };
};

export default useUser;
