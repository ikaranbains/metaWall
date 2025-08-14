import { Route, Routes } from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Home from "./components/Home";
import { Toaster } from "react-hot-toast";
import HomeWrapper from "./components/wrappers/HomeWrapper";

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
			</Routes>
		</div>
	);
};

export default App;
