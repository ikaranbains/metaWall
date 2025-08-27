import { useWallet } from "../context/WalletContext";
import AddressBox from "./common/AddressBox";
import {IoIosArrowDown} from "react-icons/io"

const FromSection = ({
	walletAddress,
	selectedOption,
	showStep2,
	amtInput,
	handleAmtChange,
	balance,
	onSubmit,
	formId,
	setShowSelectTokenModal,
	selectedAsset,
}) => {
	const { accountName } = useWallet();
	return (
		<section>
			<p className="text-lg">From</p>
			<AddressBox
				address={walletAddress}
				title={accountName}
				addressClass="text-sm text-gray-400"
				close={false}
			/>

			{showStep2 && (
				<>
					<div className="border border-gray-300 mt-2 rounded-lg p-3 flex items-center justify-between">
						<div
							onClick={() => setShowSelectTokenModal(true)}
							className="cursor-pointer hover:bg-zinc-100 rounded px-3 py-2 flex items-center gap-4"
						>
							<span className="relative inline-flex w-7 h-7 items-center justify-center bg-zinc-200 rounded-full">
								{selectedAsset
									? selectedAsset?.symbol?.slice(0, 1).toUpperCase()
									: "?"}
								<span className="w-4 h-4 absolute -bottom-1 -right-1 rounded-full bg-zinc-100 text-[.7rem] flex items-center justify-center font-thin">
									{selectedOption ? selectedOption?.name.slice(0, 1) : "?"}
								</span>
							</span>
							<p>{selectedAsset?.symbol || "?"}</p>
							<IoIosArrowDown />
						</div>
						<form
							id={formId}
							onSubmit={onSubmit}
							className="flex w-[10vw] items-center justify-center"
						>
							<input
								value={amtInput}
								type="number"
								name="amount"
								placeholder="0"
								className="w-full text-right outline-none py-1 px-2 bg-transparent"
								onChange={handleAmtChange}
							/>
							<span>{selectedAsset?.symbol || ""}</span>
						</form>
					</div>
					<span className="text-sm text-gray-500 pl-1">
						Balance: {selectedAsset?.formattedBalance || balance}
					</span>
				</>
			)}
		</section>
	);
};

export default FromSection;
