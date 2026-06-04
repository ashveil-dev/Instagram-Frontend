import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import Modal from "@/containers/modal/Modal";
import App from "./App.tsx";
import LoadingComponent from "@/components/auth/Loading";
import "./index.css";

const useHashRouter =
	import.meta.env.VITE_USE_HASH_ROUTER === "true" ||
	import.meta.env.VITE_USE_MOCK_API === "true";

const routerBasename = useHashRouter
	? ""
	: import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

if (!useHashRouter) {
	const ghPagesRedirect = sessionStorage.getItem("ghPagesRedirect");
	if (ghPagesRedirect) {
		sessionStorage.removeItem("ghPagesRedirect");
		const target = `${routerBasename}${ghPagesRedirect}`.replace(
			/\/+/g,
			"/"
		);
		window.history.replaceState(null, "", target);
	}
}

const Router = useHashRouter ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById("root")!).render(
	<Provider store={store}>
		<PersistGate loading={<LoadingComponent />} persistor={persistor}>
			<Router basename={routerBasename}>
				<Modal />
				<App />
			</Router>
		</PersistGate>
	</Provider>
);
