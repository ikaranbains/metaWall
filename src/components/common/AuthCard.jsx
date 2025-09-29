const AuthCard = ({ children }) => {
	return (
		<div className="min-h-full w-full flex items-center py-20 flex-col">
			<h1 className="text-3xl font-semibold">MetaWall - Secure Web3 wallet</h1>
			<div className="mt-25 py-10 shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] md:max-w-[35vw] w-[35vw] min-h-80 p-4 flex items-center justify-center flex-col gap-3 rounded overflow-hidden">
				{children}
			</div>
		</div>
	);
};

export default AuthCard;
