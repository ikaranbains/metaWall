import { Route, Routes } from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Home from "./components/Home";
import { Toaster } from "react-hot-toast";
import HomeWrapper from "./components/wrappers/HomeWrapper";
import Send from "./components/Send";
import NotFoundPage from "./components/NotFoundPage";
import ReviewTx from "./components/ReviewTx";

const App = () => {
	return (
		<div className="h-screen w-screen overflow-x-hidden">
			<Toaster />
			<Routes>
				<Route path="/" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route
					path="/home"
					element={
						<HomeWrapper>
							<Home />
						</HomeWrapper>
					}
				/>
				<Route path="/send" element={<Send />} />
				<Route path="/review" element={<ReviewTx />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</div>
	);
};

export default App;
