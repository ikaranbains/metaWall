const HomeButton = ({ onClick, icon, title }) => {
	return (
		<div className="flex items-center justify-center flex-col">
			<span
				onClick={onClick}
				className="w-10 h-10 inline-flex rounded-full items-center justify-center bg-zinc-200 cursor-pointer hover:bg-zinc-300"
			>
				{icon}
			</span>
			{title}
		</div>
	);
};

export default HomeButton;
