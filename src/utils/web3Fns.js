export const calculateGasFee = async ({ web3, from, to, amt, chainId }) => {
  if (!web3) throw new Error("No web3 provider");
  try {
    const value = web3.utils.toWei(amt?.toString() || "0", "ether");

    const [gasPrice, gasLimit, block] = await Promise.all([
      web3.eth.getGasPrice(),
      web3.eth.estimateGas({ from, to, value }),
      web3.eth.getBlock("latest"),
    ]);

    if (Number(chainId) === 11155111) { // Sepolia
      const totalFeeWei = BigInt(gasLimit) * BigInt(gasPrice);
      const totalFeeEther = web3.utils.fromWei(totalFeeWei.toString(), "ether");

      return { gasPrice, gasLimit, totalFeeEther };
    }

    // Polygon Amoy (80002) / Mainnet (137)
    const baseFee = block.baseFeePerGas;
    let tip;

    if (Number(chainId) === 80002 || Number(chainId) === 137) {
      // Set tip to at least 30 gwei instead of 2
      tip = web3.utils.toWei("30", "gwei");
    } else {
      tip = web3.utils.toWei("2", "gwei");
    }

    let maxFeePerGas = BigInt(baseFee) + BigInt(tip);

    // Enforce Polygon min gas 30 gwei
    const minGasPrice = BigInt(web3.utils.toWei("30", "gwei"));
    if (maxFeePerGas < minGasPrice) {
      maxFeePerGas = minGasPrice;
    }

    const totalFeeWei = BigInt(gasLimit) * maxFeePerGas;
    const totalFeeEther = web3.utils.fromWei(totalFeeWei.toString(), "ether");

    return {
      gasLimit,
      maxPriorityFeePerGas: tip,
      maxFeePerGas: maxFeePerGas.toString(),
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
	gasPrice, // for ETH chains
	maxFeePerGas, // for Polygon
	maxPriorityFeePerGas, // for Polygon
	nonce,
	privateKey,
	chainId,
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
			nonce,
			chainId,
		};

		if (Number(chainId) === 80002) {
			// Polygon family EIP‑1559
			tx.maxFeePerGas = maxFeePerGas;
			tx.maxPriorityFeePerGas = maxPriorityFeePerGas;
		} else {
			// Ethereum/Sepolia
			tx.gasPrice = gasPrice;
		}

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
