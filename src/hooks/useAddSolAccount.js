import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getDataById, updateData } from "../utils/idb";
import { Keypair } from "@solana/web3.js";

function exportSecret(keypair) {
	return Array.from(keypair?.secretKey);
}

export const useAddSolAccount = () => {
	const queryClient = useQueryClient();
	const id = localStorage.getItem("loggedUserId");

	return useMutation({
		mutationFn: async (accountName) => {
			if (!id) throw new Error("No logged in user");

			// note: Generate new solana account
			const keypair = Keypair.generate();
			const newSolAcc = {
				name: accountName || "Solana Account 1",
				account: keypair.publicKey.toBase58(),
				secretKey: exportSecret(keypair),
				type: "sol",
			};

			// note: Load user from DB
			const user = await getDataById(id);
			if (!user) throw new Error("User not found");

			// note: update user wallet
			const updatedWallet = [...(user?.userWallet || []), newSolAcc];
			await updateData({ userWallet: updatedWallet }, id);

			return newSolAcc;
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["user", id]);
		},
	});
};
