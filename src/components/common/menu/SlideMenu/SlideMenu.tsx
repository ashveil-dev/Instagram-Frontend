import NotificationSlide from "./slide/Notification/Notification";
import SearchSlide from "./slide/Search/Search";

interface ISlideMenu {
	slide: string;
}

function SlideMenu({ slide }: ISlideMenu) {
	return (
		<div
			className={
				"absolute right-0 z-[1000] bg-[white] py-[8px] top-0 bottom-0 w-[397px] border-r-[#dbdbdb] shadow-[4px_0_24px_rgba(0,0,0,0.15)] rounded-tr-[16px] rounded-br-[16px] transition-transform origin-top-left " +
				(slide !== ""
					? "left-[72px] scale-x-100 delay-[400ms] duration-[150ms]"
					: "scale-x-0 delay-0 duration-0")
			}
		>
			{slide === "notification" && <NotificationSlide />}
			{slide === "search" && <SearchSlide />}
		</div>
	);
}

export default SlideMenu;
