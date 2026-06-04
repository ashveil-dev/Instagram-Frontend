import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/utils/hooks/redux";
import { setIsLogin } from "@/slices/user/slice";
import { setDetailMenu } from "@/slices/view/slice";
import DetailMenuComponent from "@/components/common/menu/DetailMenu/DetailMenu";

interface IDetailMenuContainer {
	show: boolean;
}

function DetailMenuContainer({ show }: IDetailMenuContainer) {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const close = useCallback(() => {
		dispatch(setDetailMenu(false));
	}, [dispatch]);

	const navigateTo = useCallback(
		(path: string) => () => {
			close();
			navigate(path);
		},
		[close, navigate]
	);

	const logout = useCallback(() => {
		dispatch(setIsLogin(false));
		close();
		navigate("/");
	}, [dispatch, close, navigate]);

	const report = useCallback(() => {
		alert("문제 신고가 접수되었습니다. 검토 후 연락드리겠습니다.");
		close();
	}, [close]);

	const switchAccount = useCallback(() => {
		dispatch(setIsLogin(false));
		close();
		navigate("/");
	}, [dispatch, close, navigate]);

	return (
		<DetailMenuComponent
			show={show}
			onSettings={navigateTo("/settings")}
			onActivity={navigateTo("/activity")}
			onSaved={navigateTo("/saved")}
			onTheme={navigateTo("/settings")}
			onReport={report}
			onSwitchAccount={switchAccount}
			onLogout={logout}
		/>
	);
}

export default DetailMenuContainer;
