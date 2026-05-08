import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/utils/hooks/redux";
import { checkThunk } from "@/slices/user/thunk";
import { useNavigate, useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/Auth";
import HomePage from "./pages/Home";
import LoadingComponent from "@/components/auth/Loading";

function App() {
	const loading = useAppSelector((state) => state.user.loading);
	const isLogin = useAppSelector((state) => state.user.isLogin);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	// accessToken과 RefreshToken이 유효한 지 확인하는 루틴
	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");
		const refreshToken = localStorage.getItem("refreshToken");

		dispatch(checkThunk({ accessToken, refreshToken }));
	}, [location.pathname, dispatch]);

	// isLogin을 통한 페이지 접근 권한 설정
	useEffect(() => {
		// 로그인 o, 인증페이지일 경우
		if (isLogin && location.pathname === "/") {
			return navigate("/home");
		}

		// 로그인 x, 인증페이지가 아닐 경우
		if (!isLogin && location.pathname !== "/") {
			return navigate("/");
		}
	}, [location.pathname, navigate, isLogin]);

	return (
		<>
			{loading && <LoadingComponent />}
			<Routes>
				<Route path="/" element={<AuthPage />} />
				<Route path="/home" element={<HomePage />} />
			</Routes>
		</>
	);
}

export default App;
