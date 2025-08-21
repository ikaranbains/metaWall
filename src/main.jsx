import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { WalletContext } from "./context/WalletContext.jsx";
import { NetworkContext } from "./context/NetworkContext.jsx";
import { TxContext } from "./context/TxContext.jsx";

createRoot(document.getElementById("root")).render(
	<NetworkContext>
		<WalletContext>
			<TxContext>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</TxContext>
		</WalletContext>
	</NetworkContext>
);
