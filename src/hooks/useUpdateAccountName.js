import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getDataById, updateData } from "../utils/idb";

export const useUpdateAccountName = () => {
	const queryClient = useQueryClient();
	const id = localStorage.getItem("loggedUserId");

	return useMutation({
		mutationFn: async ({ accountAddress, newName }) => {
			if (!id) throw new Error("No logged in user");
			const user = await getDataById(id);
			if (!user) throw new Error("User not found");

			const updatedWallet = user?.userWallet.map((acc) => {
				return acc?.account === accountAddress
					? { ...acc, name: newName }
					: acc;
			});

			await updateData({ userWallet: updatedWallet }, id);

			return updatedWallet;
		},

		onSuccess: () => {
			queryClient.invalidateQueries(["user", id]);
		},
	});
};
