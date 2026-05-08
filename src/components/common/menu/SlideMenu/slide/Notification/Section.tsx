import ProfileImageButton from "@/atoms/button/ProfileImageButton";

interface INotificationSection {
	type: "follow" | "thread";
	term: string;
	isFirst?: boolean;
	author: string;
	title?: string;
	content?: string;
	pastTime: string;
	profileImage: string;
}

const textByType = {
	thread: "님이 회원님이 좋아할만한 스레드를 게시했습니다 : ",
	follow: "님이 회원님을 팔로우하기 시작했습니다.",
};

function NotificationSection({
	type,
	term,
	isFirst,
	author,
	title,
	content,
	pastTime,
	profileImage,
}: INotificationSection) {
	return (
		<div>
			{!isFirst && (
				<div className="mt-[12px] mb-[12px]">
					<hr className="h-[1px] bg-[#dbdbdb]" />
				</div>
			)}
			<div className="px-[24px] mb-[18px] text-[16px] font-bold">
				{term}
			</div>
			<div className="px-[24px] py-[8px] flex items-center">
				<div className="flex-grow basis-auto mr-[12px] flex-shrink-0 ">
					<div className="w-[44px] h-[44px]">
						<ProfileImageButton image={profileImage} />
					</div>
				</div>
				<div className="leading-[18px] font-normal text-[14px] break-words whitespace-pre-line">
					<p>
						<strong>{author}</strong>
						<span>{textByType[type]}</span>

						{type === "thread" && (
							<>
								<span>{title}</span>
								{content && (
									<>
										<br />
										<br />
										<span className="mt-[10px]">
											{content}
										</span>
									</>
								)}
							</>
						)}

						<span className="break-words font-normal text-[rgb(115,115,115)] whitespace-pre-line">
							{" "}
							{pastTime}
						</span>
					</p>
				</div>
				{type === "follow" && (
					<div className="shrink-0">
						<button className="w-full border-none bg-[rgb(239,239,239)] rounded-[8px] flex items-center justify-center py-[7px] px-[16px] font-bold text-[14px] leading-[18px]">
							팔로잉
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default NotificationSection;
