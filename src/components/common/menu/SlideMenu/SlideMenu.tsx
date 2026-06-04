import NotificationSlide from "@/containers/common/Menu/SlideMenu/Notification";
import SearchSlide from "@/containers/common/Menu/SlideMenu/Search";

interface ISlideMenu {
	slide: string;
}

const SLIDE_PANEL_WIDTH = 397;
const SIDEBAR_COLLAPSED_WIDTH = 72;

function SlideMenu({ slide }: ISlideMenu) {
	if (slide === "") {
		return null;
	}

	return (
		<aside
			className={
				"fixed top-0 bottom-0 z-[1000] flex flex-col bg-white " +
				"border-r border-[#dbdbdb] shadow-[4px_0_24px_rgba(0,0,0,0.15)] " +
				"rounded-tr-[16px] rounded-br-[16px]"
			}
			style={{
				left: SIDEBAR_COLLAPSED_WIDTH,
				width: SLIDE_PANEL_WIDTH,
			}}
		>
			<div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-[8px]">
				{slide === "notification" && <NotificationSlide />}
				{slide === "search" && <SearchSlide />}
			</div>
		</aside>
	);
}

export default SlideMenu;
