import { getDataById } from "../utils/idb";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
	const id = localStorage.getItem("loggedUserId");

	// useEffect(() => {
	// 	const getUser = async (id) => {
	// 		const user = await getDataById(id);
	// 		setUserData(user);
	// 	};

	// 	if (id && !userData) getUser(id);
	// }, []);

	return useQuery({
		queryKey: ["user", id],
		queryFn: () => getDataById(id),
		enabled: !!id,
	});
};
