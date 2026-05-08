import SettingIcon from "@/assets/images/icons/settings.svg";
import ActivityIcon from "@/assets/images/icons/activicites.svg";
import BookMarkIcon from "@/assets/images/icons/bookmark.svg";
import SunIcon from "@/assets/images/icons/sun.svg";
import ErrorIcon from "@/assets/images/icons/error.svg";

interface IDetailMenu {
	show: boolean;
}

function DetailMenu({ show }: IDetailMenu) {
	return (
		show && (
			<div className="z-[1000] fixed bottom-[85px] left-[24px] bg-[#ffffff] rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,.15)] w-[266px] text-[14px]">
				<div className="p-[8px]">
					<div className="p-[16px] ">
						<a href="#설정" className="flex gap-[12px]">
							<span>
								<img src={SettingIcon} />
							</span>
							<span>설정</span>
						</a>
					</div>
					<div className="p-[16px]">
						<a href="#내 활동" className="flex gap-[12px]">
							<span>
								<img src={ActivityIcon} />
							</span>
							<span>내 활동</span>
						</a>
					</div>
					<div className="p-[16px] ">
						<a href="# 저장됨" className="flex gap-[12px]">
							<span>
								<img src={BookMarkIcon} />
							</span>
							<span>저장됨</span>
						</a>
					</div>
					<div className="p-[16px] ">
						<a href="#모드 전환" className="flex gap-[12px]">
							<span>
								<img src={SunIcon} />
							</span>
							<span>모드 전환</span>
						</a>
					</div>
					<div className="p-[16px] ">
						<a href="#문제 신고" className="flex gap-[12px]">
							<span>
								<img src={ErrorIcon} />
							</span>
							<span>문제 신고</span>
						</a>
					</div>
					<div className="h-[6px] my-[8px] mx-[-8px] bg-[rgba(219,219,219,.3)]" />
					<div className="p-[16px]">
						<a href="#계정 전환">계정 전환</a>
					</div>
					<div className="h-[.5px] my-[8px] mx-[-8px] bg-[rgba(219,219,219,.5)]" />
					<div className="p-[16px]">
						<a href="#로그아웃">로그아웃</a>
					</div>
				</div>
			</div>
		)
	);
}

export default DetailMenu;
