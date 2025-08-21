const Loader = () => {
	return (
		<div className="w-full h-full flex items-center justify-center overflow-hidden absolute backdrop-blur-lg top-0">
			<div className="loader border-t-2 rounded-full border-yellow-500 bg-yellow-300 animate-spin aspect-square w-16 text-2xl flex justify-center items-center text-yellow-700">
				€
			</div>
		</div>
	);
};

export default Loader;
