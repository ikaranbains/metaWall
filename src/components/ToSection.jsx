import AddressBox from "./common/AddressBox";
import { MdOutlineQrCodeScanner } from "react-icons/md";

const ToSection = ({
	addressInput,
	showStep2,
	handleAddressChange,
	onSubmit,
	onClear,
	formId,
}) => (
	<section>
		<p className="text-lg mb-2">To</p>
		{!showStep2 ? (
			<form
				id={formId}
				onSubmit={onSubmit}
				className="flex w-full mt-2 items-center justify-center rounded-lg border py-4 border-gray-300"
			>
				<input
					type="text"
					name="address"
					placeholder="Enter public address (0x)..."
					className="w-[60vw] border-none outline-none font-thin text-md"
					onChange={handleAddressChange}
				/>
				<MdOutlineQrCodeScanner size={22} className="cursor-pointer" />
			</form>
		) : (
			<AddressBox
				address={addressInput}
				onClick={onClear}
				addressClass="text-black"
				parentClass="py-2"
                close={true}
			/>
		)}
	</section>
);

export default ToSection;
