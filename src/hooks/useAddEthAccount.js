import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getDataById, updateData } from "../utils/idb";

export const useAddEthAccount = (web3) => {
	const queryClient = useQueryClient();
	const id = localStorage.getItem("loggedUserId");

	return useMutation({
		mutationFn: async (accountName) => {
			const newAcc = web3.eth.accounts.create();
			const newAccObj = {
				name: accountName,
				account: newAcc.address,
				privateKey: newAcc.privateKey,
			};

			const user = await getDataById(id);

			const updatedWallet = [...(user?.userWallet || []), newAccObj];
			await updateData({ userWallet: updatedWallet }, id);
			return newAccObj;
		},

		onSuccess: () => {
			queryClient.invalidateQueries(["user", id]);
		},
	});
};
