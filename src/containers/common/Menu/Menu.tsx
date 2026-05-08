import MainMenu from "@/containers/common/Menu/MainMenu";
import SlideMenu from "@/containers/common/Menu/SlideMenu";
import DetailMenu from "@/containers/common/Menu/DetailMenu";

function Menu() {
	return (
		<div className="relative flex h-dvh">
			<div className="flex flex-row h-full">
				<MainMenu />
				<SlideMenu />
				<DetailMenu />
			</div>
		</div>
	);
}

export default Menu;
