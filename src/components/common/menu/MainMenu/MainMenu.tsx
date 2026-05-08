import MenuButton from "@/atoms/button/MenuButton";
import LogoImage from "@/assets/images/logo.svg";
import InstagramIcon from "@/assets/images/icons/instagram.svg";
import HomeIcon from "@/assets/images/icons/home.svg";
import HomeFilledIcon from "@/assets/images/icons/home_fill.svg";
import SearchIcon from "@/assets/images/icons/search.svg";
import SearchFilledIcon from "@/assets/images/icons/search_fill.svg";
import CompassIcon from "@/assets/images/icons/compass.svg";
import CompassFilledIcon from "@/assets/images/icons/compass_fill.svg";
import ReelsIcon from "@/assets/images/icons/reels.svg";
import ReelsFilledIcon from "@/assets/images/icons/reels_fill.svg";
import DirectIcon from "@/assets/images/icons/direct.svg";
import DirectFilledIcon from "@/assets/images/icons/direct_fill.svg";
import HeartIcon from "@/assets/images/icons/heart.svg";
import HeartFilledIcon from "@/assets/images/icons/heart_fill.svg";
import MakeIcon from "@/assets/images/icons/make.svg";
import ThreadIcon from "@/assets/images/icons/thread.svg";
import MenuIcon from "@/assets/images/icons/menu.svg";

interface IMainMenu {
	extend: boolean;
	buttonOnClick: (key: string) => () => void;
	currentClickedButton: string;
}

function MainMenu({ extend, buttonOnClick, currentClickedButton }: IMainMenu) {
	return (
		<div
			className={
				"flex flex-col px-[12px] pt-[8px] pb-[20px] border-r-[1px] bg-#ffffff] border-r-[#dbdbdb] z-[1] transition-[width] " +
				(extend
					? "min-w-[146px] w-[244px] "
					: "w-[72px] duration-[800ms]")
			}
		>
			<div className="mb-[19px] pt-[25px] pb-[16px] px-[12px] h-[73px]">
				<a href="/">
					{extend ? (
						<img src={LogoImage} />
					) : (
						<img src={InstagramIcon} />
					)}
				</a>
			</div>
			<div className="flex-grow">
				<MenuButton
					index="home"
					icon={HomeIcon}
					iconOnClicked={HomeFilledIcon}
					label="홈"
					currentIndexInButtonClicked={currentClickedButton}
					showLabel={extend}
					buttonOnClick={buttonOnClick}
				/>
				<MenuButton
					index="search"
					icon={SearchIcon}
					iconOnClicked={SearchFilledIcon}
					label="검색"
					currentIndexInButtonClicked={currentClickedButton}
					showLabel={extend}
					buttonOnClick={buttonOnClick}
				/>
				<MenuButton
					index="explore"
					icon={CompassIcon}
					iconOnClicked={CompassFilledIcon}
					label="탐색 탭"
					currentIndexInButtonClicked={currentClickedButton}
					showLabel={extend}
					buttonOnClick={buttonOnClick}
				/>
				<MenuButton
					index="reels"
					icon={ReelsIcon}
					iconOnClicked={ReelsFilledIcon}
					label="릴스"
					currentIndexInButtonClicked={currentClickedButton}
					showLabel={extend}
					buttonOnClick={buttonOnClick}
				/>
				<MenuButton
					index="direct"
					icon={DirectIcon}
					iconOnClicked={DirectFilledIcon}
					label="메시지"
					currentIndexInButtonClicked={currentClickedButton}
					showLabel={extend}
					buttonOnClick={buttonOnClick}
				/>
				<MenuButton
					index="notification"
					icon={HeartIcon}
					iconOnClicked={HeartFilledIcon}
					label="알림"
					currentIndexInButtonClicked={currentClickedButton}
					showLabel={extend}
					buttonOnClick={buttonOnClick}
				/>
				<MenuButton
					index="createPost"
					icon={MakeIcon}
					iconOnClicked={MakeIcon}
					label="만들기"
					currentIndexInButtonClicked={currentClickedButton}
					showLabel={extend}
					buttonOnClick={buttonOnClick}
				/>
				<MenuButton
					index="profile"
					icon={HomeIcon}
					iconOnClicked={HomeIcon}
					label="프로필"
					currentIndexInButtonClicked={currentClickedButton}
					showLabel={extend}
					buttonOnClick={buttonOnClick}
				/>
			</div>
			<div>
				<MenuButton
					index="threads"
					icon={ThreadIcon}
					iconOnClicked={ThreadIcon}
					label="Threads"
					currentIndexInButtonClicked={currentClickedButton}
					showLabel={extend}
					buttonOnClick={buttonOnClick}
				/>
				<MenuButton
					index="menu"
					icon={MenuIcon}
					iconOnClicked={MenuIcon}
					label="더 보기"
					currentIndexInButtonClicked={currentClickedButton}
					showLabel={extend}
					buttonOnClick={buttonOnClick}
				/>
			</div>
		</div>
	);
}

export default MainMenu;
