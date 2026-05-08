import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/utils/hooks/redux";
import MainMenuComponent from "@/components/common/menu/MainMenu/MainMenu";
import { setSlideMenu, setModal, toggleDetailMenu } from "@/slices/view/slice";

function MainMenuContainer() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [extend, setExtend] = useState(true);
	const [currentClickedButton, setCurrentClickedButton] = useState("home");

	const movePage = useCallback(
		(key: string) => {
			dispatch(setSlideMenu(""));
			return navigate("/" + key);
		},
		[dispatch, navigate]
	);

	const toggleSlideMenu = useCallback(
		(key: string) => {
			if (key === currentClickedButton) {
				setExtend((_extend) => !_extend);
				dispatch(setSlideMenu(extend ? key : ""));
				if (!extend)
					setCurrentClickedButton(location.pathname.split("/")[1]);
			} else {
				setExtend(false);
				dispatch(setSlideMenu(key));
			}
		},
		[currentClickedButton, dispatch, extend]
	);

	const showModal = useCallback(
		(key: string) => {
			dispatch(setModal(key));
			setCurrentClickedButton(currentClickedButton);
		},
		[dispatch, currentClickedButton]
	);

	const buttonOnClick = useCallback(
		(key: string) => () => {
			setCurrentClickedButton(key);
			if (
				["home", "explore", "reels", "direct", "profile"].includes(key)
			) {
				if (key === "direct") setExtend(false);
				else setExtend(true);
				movePage(key);
			} else if (["search", "notification"].includes(key)) {
				toggleSlideMenu(key);
			} else if ("threads" === key)
				window.open("https://threads.net", "_blank");
			else if ("createPost" === key) {
				showModal(key);
			} else if ("menu" === key) dispatch(toggleDetailMenu());
			else {
				alert("error");
			}
		},
		[dispatch, movePage, toggleSlideMenu, showModal]
	);

	return (
		<MainMenuComponent
			extend={extend}
			buttonOnClick={buttonOnClick}
			currentClickedButton={currentClickedButton}
		/>
	);
}

export default MainMenuContainer;
