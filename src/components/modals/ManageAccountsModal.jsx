import { AnimatePresence, motion } from "framer-motion";
import { IoIosClose } from "react-icons/io";
import ModalHeader from "../common/ModalHeader";
import DeterministicPieIcon from "../common/DeterministicPieIcon";
import Address from "../common/Address";
import { TbDotsVertical } from "react-icons/tb";
import { useAccounts } from "../../context/AccountsContext";

const ManageAccountsModal = ({
	isOpen,
	onClose,
	walletAddress,
	accountName,
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
					transition={{ duration: 0.25 }}
				>
					{/* Modal container */}
					<motion.div
						className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-300 bg-white mt-13 w-[20%] m-auto h-[50vh] flex flex-col rounded-lg overflow-hidden items-center justify-between"
						initial={{ opacity: 0, scale: 0.85, y: -40 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 40 }}
						transition={{ duration: 0.35, ease: "easeInOut" }}
					>
						<div className="w-full min-h-full">
							<ModalHeader title="Accounts" onClose={onClose} />
							<div className="w-full mt-4 px-3 flex flex-col gap-2 pb-7">
								<div className="border-b-2 w-full"></div>
								<ul className="list-none mt-3 flex flex-col gap-3 h-85 overflow-y-scroll">
									{accountsList && accountsList.length > 0 ? (
										accountsList.map((acc, idx) => {
											return (
												<li key={idx} onClick={() => alert("selected acc.")}>
													<div className="w-full flex items-center gap-2 overflow-y-scroll my-scroll">
														<span className="w-1 h-8 bg-black rounded-lg"></span>

														<div
															className={`w-full cursor-pointer py-2 flex items-center justify-between px-3 rounded-lg bg-black text-white`}
														>
															<div className="min-w-1/2">
																<div className={`flex items-center gap-5`}>
																	{walletAddress && (
																		<DeterministicPieIcon
																			address={walletAddress}
																			size={22}
																		/>
																	)}
																	<div>
																		<p>{accountName}</p>
																		<Address
																			address={walletAddress}
																			className="text-sm text-gray-100"
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
								<button className="text-white w-full m-auto py-1.5 text-lg rounded-lg bg-black hover:bg-zinc-900 cursor-pointer mt-2 border-none outline-none">
									Add new account
								</button>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ManageAccountsModal;
