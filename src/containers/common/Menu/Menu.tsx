import MainMenu from "@/containers/common/Menu/MainMenu";
import SlideMenu from "@/containers/common/Menu/SlideMenu";
import DetailMenuContainer from "@/containers/common/Menu/DetailMenu";
import { useAppSelector } from "@/utils/hooks/redux";

function Menu() {
	const showDetailMenu = useAppSelector((state) => state.view.detailMenu);

	return (
		<div className="relative z-[1] flex-shrink-0 h-dvh">
			<MainMenu />
			<SlideMenu />
			<DetailMenuContainer show={showDetailMenu} />
		</div>
	);
}

export default Menu;
