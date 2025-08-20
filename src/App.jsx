import { Route, Routes } from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Home from "./components/Home";
import { Toaster } from "react-hot-toast";
import HomeWrapper from "./components/wrappers/HomeWrapper";
import Send from "./components/Send";
import Receive from "./components/Receive";
import NotFoundPage from "./components/NotFoundPage";

const App = () => {
	return (
		<div className="h-screen w-screen">
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
				<Route path="/receive" element={<Receive />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</div>
	);
};

export default App;
