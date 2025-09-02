import { getDataById } from "../utils/idb";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
	const id = localStorage.getItem("loggedUserId");

	return useQuery({
		queryKey: ["user", id],
		queryFn: () => getDataById(id),
		enabled: !!id,
	});
};
