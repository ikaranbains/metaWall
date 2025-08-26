import React, { useEffect, useState } from "react";
import TxHeader from "./common/TxHeader";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import DeterministicPieIcon from "./common/DeterministicPieIcon";
import AccountStripWrapper from "./common/AccountStripWrapper";
import { MdArrowForwardIos, MdOutlineEdit } from "react-icons/md";
import AccountStrip from "./common/AccountStrip";
import EditAccountNameModal from "./modals/EditAccountNameModal";
import toast from "react-hot-toast";

const AccountsPage = () => {
	const navigate = useNavigate();
	const { walletAddress } = useWallet();
	const [showEditModal, setShowEditModal] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const { accountName, setAccountName } = useWallet();
	const [accountNameInput, setAccountNameInput] = useState("");

	const handleAccountName = () => {
		setAccountName(accountNameInput.trim());
		setShowEditModal(false);
		toast.success("Account name updated successfully");
		setAccountNameInput("");
	};

	useEffect(() => {
		if (accountNameInput.trim().length > 0) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [accountNameInput]);

	return (
		<div className="w-full h-full flex items-center justify-center">
			{showEditModal && (
				<EditAccountNameModal
					isOpen={showEditModal}
					onClose={() => setShowEditModal(false)}
					disabled={disabled}
					accountName={accountName}
					setAccountName={setAccountName}
					accountNameInput={accountNameInput}
					setAccountNameInput={setAccountNameInput}
					handleAccountName={handleAccountName}
				/>
			)}
			<div className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-300 bg-white mt-13 w-[30%] m-auto min-h-[90vh] flex flex-col">
				<TxHeader
					onClick={() => navigate("/home")}
					className="mt-3 justify-between"
					title="Account Details"
				/>

				<div className="mt-10 h-190 flex flex-col gap-5 pb-10 px-5 w-full">
					<div className="flex flex-col gap-10 items-center">
						{walletAddress && (
							<DeterministicPieIcon address={walletAddress} size={40} />
						)}
					</div>
					<div className="flex flex-col items-center gap-3 w-full h-70">
						<AccountStripWrapper>
							<AccountStrip
								title="Account name"
								p={accountName}
								icon={<MdOutlineEdit />}
								onClick={() => setShowEditModal(true)}
							/>
							<AccountStrip
								title="Address"
								p={walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4)}
								icon={<MdArrowForwardIos />}
							/>
						</AccountStripWrapper>
						<AccountStripWrapper>
							<AccountStrip
								title="Secret Recovery Phrase"
								icon={<MdArrowForwardIos />}
							/>
							<AccountStrip title="Private key" icon={<MdArrowForwardIos />} />
						</AccountStripWrapper>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AccountsPage;
