import { useEffect, useState } from "react";
import { getDataById } from "../utils/idb";

export default useUser = () => {
	const [userData, setUserData] = useState(null);
	useEffect(() => {
		const id = localStorage.getItem("loggedUserId");
		const getUser = async (id) => {
			const user = await getDataById(id);
			setUserData(user);
		};

		if (id && !userData) getUser(id);
	}, []);

	return { userData };
};
