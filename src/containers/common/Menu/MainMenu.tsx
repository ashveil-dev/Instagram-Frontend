import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/utils/hooks/redux";
import MainMenuComponent from "@/components/common/menu/MainMenu/MainMenu";
import {
	setSlideMenu,
	setModal,
	toggleDetailMenu,
} from "@/slices/view/slice";

const pathToKey: Record<string, string> = {
	home: "home",
	explore: "explore",
	reels: "reels",
	direct: "direct",
	profile: "profile",
	saved: "menu",
	activity: "menu",
	settings: "menu",
};

function MainMenuContainer() {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useAppDispatch();
	const slideMenu = useAppSelector((state) => state.view.slideMenu);
	const [extend, setExtend] = useState(true);
	const [currentClickedButton, setCurrentClickedButton] = useState("home");

	useEffect(() => {
		const segment = location.pathname.split("/")[1] || "home";
		const key = pathToKey[segment] ?? segment;
		setCurrentClickedButton(key);

		if (segment === "direct") {
			setExtend(false);
		} else if (slideMenu === "") {
			setExtend(true);
		}
	}, [location.pathname, slideMenu]);

	const movePage = useCallback(
		(key: string) => {
			dispatch(setSlideMenu(""));
			if (key === "profile") {
				return navigate("/profile");
			}
			return navigate("/" + key);
		},
		[dispatch, navigate]
	);

	const toggleSlideMenu = useCallback(
		(key: string) => {
			if (slideMenu === key) {
				dispatch(setSlideMenu(""));
				setExtend(true);
			} else {
				dispatch(setSlideMenu(key));
				setExtend(false);
			}
			setCurrentClickedButton(key);
		},
		[dispatch, slideMenu]
	);

	const showModal = useCallback(
		(key: string) => {
			dispatch(setModal("createPost"));
			dispatch(setSlideMenu(""));
			setCurrentClickedButton(key);
		},
		[dispatch]
	);

	const buttonOnClick = useCallback(
		(key: string) => () => {
			if (
				["home", "explore", "reels", "direct", "profile"].includes(key)
			) {
				setCurrentClickedButton(key);
				dispatch(setSlideMenu(""));
				if (key === "direct") setExtend(false);
				else setExtend(true);
				movePage(key);
			} else if (["search", "notification"].includes(key)) {
				toggleSlideMenu(key);
			} else if (key === "threads") {
				window.open("https://www.threads.net", "_blank");
			} else if (key === "createPost") {
				showModal(key);
			} else if (key === "menu") {
				dispatch(toggleDetailMenu());
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
