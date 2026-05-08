import { useAppSelector } from "@/utils/hooks/redux";
import SlideMenuComponent from "@/components/common/menu/SlideMenu/SlideMenu";

function SlideMenuContainer() {
	const slide = useAppSelector((state) => state.view.slideMenu);

	return <SlideMenuComponent slide={slide} />;
}

export default SlideMenuContainer;
