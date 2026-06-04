import SettingIcon from "@/assets/images/icons/settings.svg";
import ActivityIcon from "@/assets/images/icons/activicites.svg";
import BookMarkIcon from "@/assets/images/icons/bookmark.svg";
import SunIcon from "@/assets/images/icons/sun.svg";
import ErrorIcon from "@/assets/images/icons/error.svg";

interface IDetailMenu {
	show: boolean;
	onSettings: () => void;
	onActivity: () => void;
	onSaved: () => void;
	onTheme: () => void;
	onReport: () => void;
	onSwitchAccount: () => void;
	onLogout: () => void;
}

function DetailMenu({
	show,
	onSettings,
	onActivity,
	onSaved,
	onTheme,
	onReport,
	onSwitchAccount,
	onLogout,
}: IDetailMenu) {
	if (!show) return null;

	const itemClass =
		"flex gap-[12px] w-full text-left border-none bg-transparent cursor-pointer p-0";

	return (
		<div className="z-[1000] fixed bottom-[85px] left-[24px] bg-[#ffffff] rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,.15)] w-[266px] text-[14px]">
			<div className="p-[8px]">
				<div className="p-[16px]">
					<button type="button" className={itemClass} onClick={onSettings}>
						<img src={SettingIcon} alt="" />
						<span>설정</span>
					</button>
				</div>
				<div className="p-[16px]">
					<button type="button" className={itemClass} onClick={onActivity}>
						<img src={ActivityIcon} alt="" />
						<span>내 활동</span>
					</button>
				</div>
				<div className="p-[16px]">
					<button type="button" className={itemClass} onClick={onSaved}>
						<img src={BookMarkIcon} alt="" />
						<span>저장됨</span>
					</button>
				</div>
				<div className="p-[16px]">
					<button type="button" className={itemClass} onClick={onTheme}>
						<img src={SunIcon} alt="" />
						<span>모드 전환</span>
					</button>
				</div>
				<div className="p-[16px]">
					<button type="button" className={itemClass} onClick={onReport}>
						<img src={ErrorIcon} alt="" />
						<span>문제 신고</span>
					</button>
				</div>
				<div className="h-[6px] my-[8px] mx-[-8px] bg-[rgba(219,219,219,.3)]" />
				<div className="p-[16px]">
					<button
						type="button"
						className="border-none bg-transparent cursor-pointer p-0"
						onClick={onSwitchAccount}
					>
						계정 전환
					</button>
				</div>
				<div className="h-[.5px] my-[8px] mx-[-8px] bg-[rgba(219,219,219,.5)]" />
				<div className="p-[16px]">
					<button
						type="button"
						className="border-none bg-transparent cursor-pointer p-0"
						onClick={onLogout}
					>
						로그아웃
					</button>
				</div>
			</div>
		</div>
	);
}

export default DetailMenu;
