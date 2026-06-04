import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/utils/hooks/redux";
import { checkThunk } from "@/slices/user/thunk";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/Auth";
import AppLayout from "./pages/AppLayout";
import HomePage from "./pages/Home";
import ExplorePage from "./pages/Explore";
import ReelsPage from "./pages/Reels";
import DirectPage from "./pages/Direct";
import ProfilePage from "./pages/Profile";
import SavedPage from "./pages/Saved";
import ActivityPage from "./pages/Activity";
import SettingsPage from "./pages/Settings";
import LoadingComponent from "@/components/auth/Loading";

function App() {
	const loading = useAppSelector((state) => state.user.loading);
	const isLogin = useAppSelector((state) => state.user.isLogin);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");
		const refreshToken = localStorage.getItem("refreshToken");

		dispatch(checkThunk({ accessToken, refreshToken }));
	}, [location.pathname, dispatch]);

	useEffect(() => {
		if (isLogin && location.pathname === "/") {
			return navigate("/home");
		}

		if (!isLogin && location.pathname !== "/") {
			return navigate("/");
		}
	}, [location.pathname, navigate, isLogin]);

	return (
		<>
			{loading && <LoadingComponent />}
			<Routes>
				<Route path="/" element={<AuthPage />} />
				<Route element={<AppLayout />}>
					<Route path="/home" element={<HomePage />} />
					<Route path="/explore" element={<ExplorePage />} />
					<Route path="/reels" element={<ReelsPage />} />
					<Route path="/direct" element={<DirectPage />} />
					<Route path="/profile" element={<ProfilePage />} />
					<Route path="/profile/:nickName" element={<ProfilePage />} />
					<Route path="/saved" element={<SavedPage />} />
					<Route path="/activity" element={<ActivityPage />} />
					<Route path="/settings" element={<SettingsPage />} />
				</Route>
				<Route
					path="*"
					element={
						<Navigate to={isLogin ? "/home" : "/"} replace />
					}
				/>
			</Routes>
		</>
	);
}

export default App;
