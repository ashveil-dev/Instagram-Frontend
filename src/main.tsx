import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import Modal from "@/containers/modal/Modal";
import App from "./App.tsx";
import "./index.css";

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

const ghPagesRedirect = sessionStorage.getItem("ghPagesRedirect");
if (ghPagesRedirect) {
	sessionStorage.removeItem("ghPagesRedirect");
	const target = `${routerBasename}${ghPagesRedirect}`.replace(
		/\/+/g,
		"/"
	);
	window.history.replaceState(null, "", target);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<BrowserRouter basename={routerBasename}>
				<Modal />
				<App />
			</BrowserRouter>
		</PersistGate>
	</Provider>
);
