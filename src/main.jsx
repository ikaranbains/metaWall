import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { NetworkContext } from "./context/NetworkContext.jsx";
import { TxContext } from "./context/TxContext.jsx";
import { AccountsContext } from "./context/AccountsContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
	<QueryClientProvider client={queryClient}>
		<AccountsContext>
			<NetworkContext>
				<TxContext>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</TxContext>
			</NetworkContext>
		</AccountsContext>
	</QueryClientProvider>
);
