import { AnimatePresence, motion } from "framer-motion";
import ModalHeader from "../common/ModalHeader";
import DeterministicPieIcon from "../common/DeterministicPieIcon";
import Address from "../common/Address";
import { TbDotsVertical } from "react-icons/tb";
import { useAccounts } from "../../context/AccountsContext";
import AddAccountButton from "../buttons/AddAccountButton";
import SelectNewAccChainButton from "../buttons/SelectNewAccChainButton";
import NewAccountNameInput from "../common/NewAccountNameInput";

const ManageAccountsModal = ({
	isOpen,
	onClose,
	accStep2,
	setAccStep2,
	accStep3,
	setAccStep3,
	newAccNameInpETH,
	newAccNameInpSOL,
	handleNewAccNameChangeETH,
	handleNewAccNameChangeSOL,
	handleAddNewAccETH,
	handleAddNewAccSOL,
	isEthereum,
	setIsEthereum,
	selectedAccount,
	setSelectedAccount,
}) => {
	const { accountsList } = useAccounts();
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-[999] backdrop-blur w-full h-full flex items-center justify-center"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15 }}
				>
					{/* Modal container */}
					<motion.div
						className={`shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-300 bg-white mt-13 w-[20%] m-auto ${
							!accStep2 ? "h-[50vh]" : accStep3 ? "h-[26vh]" : "h-[22vh]"
						} flex flex-col rounded-lg overflow-hidden items-center justify-between`}
						initial={{ opacity: 0, scale: 0.85, y: -40 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 40 }}
						transition={{ duration: 0.15, ease: "easeInOut" }}
					>
						<div className="w-full min-h-full">
							<ModalHeader
								title={
									!accStep2
										? "Accounts"
										: accStep3
										? isEthereum
											? "Add ETH account"
											: "Add SOL account"
										: "Add new account"
								}
								onClose={onClose}
								accStep2={accStep2}
								setAccStep2={setAccStep2}
								accStep3={accStep3}
								setAccStep3={setAccStep3}
								isEthereum={isEthereum}
							/>
							<div className="w-full mt-4 px-3 flex flex-col gap-2 pb-7">
								<div className="border-b-2 w-full"></div>
								{!accStep2 ? (
									<ul
										className={`list-none mt-3 flex flex-col gap-3 h-85 ${
											accountsList.length > 5
												? "overflow-y-scroll"
												: "overflow-hidden"
										}`}
									>
										{accountsList && accountsList.length > 0 ? (
											accountsList.map((acc, idx) => {
												return (
													<li
														key={idx}
														onClick={() => {
															if (acc?.account === selectedAccount?.address) {
																onClose();
																return;
															}
															setSelectedAccount({
																name: acc?.name,
																address: acc?.account,
															});
															onClose();
														}}
													>
														<div className="w-full flex items-center gap-2 overflow-y-scroll my-scroll">
															<span className="w-1 h-8 bg-black rounded-lg"></span>

															<div
																className={`w-full cursor-pointer py-2 flex items-center justify-between px-3 rounded-lg
																	${
																		selectedAccount?.address === acc?.account
																			? "bg-black text-white"
																			: "hover:bg-zinc-100"
																	}
																	`}
															>
																<div className="min-w-1/2">
																	<div className={`flex items-center gap-5`}>
																		{acc?.account && (
																			<DeterministicPieIcon
																				address={acc?.account}
																				size={22}
																			/>
																		)}
																		<div>
																			<p>{acc?.name}</p>
																			<Address
																				address={acc.account}
																				className="text-sm text-gray-400"
																			/>
																		</div>
																	</div>
																</div>
																<div
																	onClick={(e) => {
																		e.stopPropagation();
																		alert("three dots");
																	}}
																	className="w-6 h-6 rounded flex items-center justify-center p-1"
																>
																	<TbDotsVertical size={22} />
																</div>
															</div>
														</div>
													</li>
												);
											})
										) : (
											<p>"Loading..." </p>
										)}
									</ul>
								) : accStep3 ? (
									isEthereum ? (
										<NewAccountNameInput
											value={newAccNameInpETH}
											onChange={handleNewAccNameChangeETH}
											name="newAccNameETH"
											placeholder="ETH Account Name"
										/>
									) : (
										<NewAccountNameInput
											value={newAccNameInpSOL}
											onChange={handleNewAccNameChangeSOL}
											name="newAccNameSOL"
											placeholder="SOL Account Name"
										/>
									)
								) : (
									<div className="h-60">
										<p className="text-sm text-gray-400 py-2">
											Create new Account
										</p>
										<div className="flex flex-col gap-2">
											<SelectNewAccChainButton
												onClick={() => {
													setAccStep3(true);
													setIsEthereum(true);
												}}
												btnTitle="Ethereum Account"
											/>
											<SelectNewAccChainButton
												onClick={() => {
													setAccStep3(true);
													setIsEthereum(false);
												}}
												btnTitle="Solana Account"
											/>
										</div>
									</div>
								)}

								{!accStep2 ? (
									<button
										onClick={() => setAccStep2(true)}
										className="text-white w-full m-auto py-1.5 text-lg rounded-lg bg-black hover:bg-zinc-900 cursor-pointer mt-3 border-none outline-none"
									>
										Add new account
									</button>
								) : accStep3 ? (
									isEthereum ? (
										<AddAccountButton
											onCancel={() => {
												setAccStep2(false);
												setAccStep3(false);
											}}
											onClick={handleAddNewAccETH}
										/>
									) : (
										<AddAccountButton
											onCancel={() => {
												setAccStep2(false);
												setAccStep3(false);
											}}
											onClick={handleAddNewAccSOL}
										/>
									)
								) : (
									""
								)}
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ManageAccountsModal;
