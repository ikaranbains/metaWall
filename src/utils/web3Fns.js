export const calculateGasFee = async ({ web3, from, to, amt }) => {
	if (!web3) return console.log("no provider");
	try {
		const value = web3.utils.toWei(amt?.toString() || "0", "ether");

		// 1.current gas price in wei
		// 2.estimate gas limit
		const [gasPrice, gasLimit, block] = await Promise.all([
			web3.eth.getGasPrice(),
			web3.eth.estimateGas({ from, to, value }),
			web3.eth.getBlock("latest"),
		]);

		const baseFee = block.baseFeePerGas;
		const tip = web3.utils.toWei("2", "gwei");
		const maxFeePerGas =
			baseFee > 0n ? (BigInt(baseFee) + BigInt(tip)).toString() : gasPrice;

		// 3.total fee in wei
		const totalFeeWei = BigInt(gasLimit) * BigInt(gasPrice);
		// 4. Convert to ETH/SPOLIAETH (depending on network)
		const totalFeeEther = web3.utils.fromWei(totalFeeWei.toString(), "ether");

		return {
			gasPrice: maxFeePerGas,
			gasLimit,
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
	gas,
	gasPrice,
	nonce,
	privateKey,
}) => {
	try {
		if (!web3) throw new Error("No web3 provider");
		if (!from || !to) throw new Error("From/To address missing");
		if (!amt) throw new Error("Amount is required");
		if (!gas || !gasPrice || nonce === undefined)
			throw new Error("Gas, gasPrice, or nonce missing");
		if (!privateKey) throw new Error("Private key missing");

		const value = web3.utils.toWei(amt?.toString() || "0", "ether");

		const tx = {
			from,
			to,
			value,
			gas,
			gasPrice,
			nonce,
		};

		const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
		const receipt = await web3.eth.sendSignedTransaction(
			signedTx.rawTransaction
		);

		return receipt;
	} catch (error) {
		console.error("Transaction error:", error);
		throw error;
	}
};
