import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomeWrapper = ({ children }) => {
	const navigate = useNavigate();
	const token = localStorage.getItem("metaWallToken");
	useEffect(() => {
		if (!token) return navigate("/login");
	}, [token]);
	return <div>{children}</div>;
};

export default HomeWrapper;
