export const calculateGasFee = async ({ web3, from, to, amt }) => {
	if (!web3) throw new Error("No web3 provider");
	try {
		const value = web3.utils.toWei(amt?.toString() || "0", "ether");

		const [gasPrice, gasLimit, block] = await Promise.all([
			web3.eth.getGasPrice(),
			web3.eth.estimateGas({ from, to, value }),
			web3.eth.getBlock("latest"),
		]);

		const baseFee = block.baseFeePerGas;

		const tip = web3.utils.toWei("2", "gwei");

		let maxFeePerGas =
			baseFee > 0n ? BigInt(baseFee) + BigInt(tip) : BigInt(gasPrice);

		const totalFeeWei = BigInt(gasLimit) * maxFeePerGas;
		const totalFeeEther = web3.utils.fromWei(totalFeeWei.toString(), "ether");

		return {
			gas: Number(gasLimit) * 2,
			gasPrice: (Number(gasPrice) * 2).toString(),
			totalFeeEther,
		};
	} catch (error) {
		throw error;
	}
};

export const sendTx = async ({
	web3,
	from,
	to,
	amt,
	gasLimit,
	gasPrice,
	nonce,
	privateKey,
}) => {
	try {
		if (!web3) throw new Error("No web3 provider");
		if (!from || !to) throw new Error("From/To address missing");
		if (!amt) throw new Error("Amount is required");
		if (!gasLimit || nonce === undefined || nonce === null) {
			throw new Error("Gas limit or nonce missing");
		}
		if (!privateKey) throw new Error("Private key missing");

		const value = web3.utils.toWei(amt?.toString() || "0", "ether");

		let tx = {
			from,
			to,
			value,
			gas: gasLimit,
			gasPrice,
			nonce,
		};

		console.log("tx built ----------------", tx);

		const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
		const receipt = await web3.eth.sendSignedTransaction(
			signedTx.rawTransaction
		);

		return receipt;
	} catch (error) {
		if (error.name === "TransactionBlockTimeoutError") {
			console.warn("Tx timeout, checking manually...");
			const hash = error.receipt?.transactionHash;
			let receipt = null;

			for (let i = 0; i < 20; i++) {
				receipt = await web3.eth.getTransactionReceipt(hash);
				if (receipt) return receipt;
				await new Promise((res) => setTimeout(res, 5000));
			}
		}
		throw error;
	}
};
