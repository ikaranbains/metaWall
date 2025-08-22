import AddressBox from "./common/AddressBox";

const FromSection = ({
	walletAddress,
	selectedOption,
	showStep2,
	amtInput,
	handleAmtChange,
	balance,
	onSubmit,
	formId,
}) => (
	<section>
		<p className="text-lg">From</p>
			<AddressBox
				address={walletAddress}
				title="Account 1"
				addressClass="text-sm text-gray-400"
				close={false}
			/>

		{showStep2 && (
			<>
				<div className="border border-gray-300 mt-2 rounded-lg p-3 flex items-center justify-between">
					<div className="bg-zinc-200 rounded px-3 py-2">
						{selectedOption?.label}
					</div>
					<form
						id={formId}
						onSubmit={onSubmit}
						className="flex w-[7vw] items-center justify-center"
					>
						<input
							value={amtInput}
							type="number"
							name="amount"
							placeholder="0"
							className="w-full text-right outline-none py-1 px-2 bg-transparent"
							onChange={handleAmtChange}
						/>
					</form>
				</div>
				<span className="text-sm text-gray-500 pl-1">Balance: {balance}</span>
			</>
		)}
	</section>
);

export default FromSection;
