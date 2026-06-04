import ProfileImageButton from "@/atoms/button/ProfileImageButton";

interface INotificationSection {
	type: "follow" | "thread" | "like" | "comment" | "message";
	term: string;
	isFirst?: boolean;
	author: string;
	title?: string;
	content?: string;
	pastTime: string;
	profileImage: string;
	showFollow?: boolean;
	isFollowing?: boolean;
	onFollowClick?: () => void;
}

const textByType = {
	thread: "님이 회원님이 좋아할만한 스레드를 게시했습니다 : ",
	follow: "님이 회원님을 팔로우하기 시작했습니다.",
	like: "님이 회원님의 게시물을 좋아합니다.",
	comment: "님이 댓글을 남겼습니다: ",
	message: "님이 메시지를 보냈습니다: ",
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
	showFollow,
	isFollowing,
	onFollowClick,
}: INotificationSection) {
	return (
		<div>
			{term && (
				<div className="px-[24px] mb-[18px] text-[16px] font-bold">
					{term}
				</div>
			)}
			{!isFirst && !term && (
				<div className="mt-[12px] mb-[12px]">
					<hr className="h-[1px] bg-[#dbdbdb]" />
				</div>
			)}
			<div className="px-[24px] py-[8px] flex items-start gap-[12px]">
				<div className="flex-shrink-0 w-[44px] h-[44px]">
					<ProfileImageButton image={profileImage} />
				</div>
				<div className="flex-grow min-w-0 leading-[18px] font-normal text-[14px] break-words">
					<p>
						<strong>{author}</strong>
						<span>{textByType[type]}</span>

						{(type === "thread" || type === "like") && title && (
							<span>{title}</span>
						)}
						{(type === "comment" || type === "message") && content && (
							<span>{content}</span>
						)}

						<span className="break-words font-normal text-[rgb(115,115,115)] whitespace-pre-line">
							{" "}
							{pastTime}
						</span>
					</p>
				</div>
				{showFollow && (
					<div className="shrink-0">
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								onFollowClick?.();
							}}
							className={
								"w-full border-none rounded-[8px] flex items-center justify-center py-[7px] px-[16px] font-bold text-[14px] leading-[18px] " +
								(isFollowing
									? "bg-[rgb(239,239,239)]"
									: "bg-[#0095f6] text-white")
							}
						>
							{isFollowing ? "팔로잉" : "팔로우"}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default NotificationSection;
