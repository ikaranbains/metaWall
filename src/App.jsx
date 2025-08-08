import { Route, Routes } from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Home from "./components/Home";

const App = () => {
	return (
		<div className="h-screen w-screen">
			<Routes>
				<Route path="/" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route path="/home" element={<Home />} />
			</Routes>
		</div>
	);
};

export default App;
