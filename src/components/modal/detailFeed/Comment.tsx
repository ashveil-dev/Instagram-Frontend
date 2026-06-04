import ProfileImageButton from "@/atoms/button/ProfileImageButton";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/profileImages";
import { resolveMediaUrl } from "@/utils/mediaUrl";
import LikeIcon from "@/assets/images/icons/like.svg?react";

interface ICommentComponent {
	id: string;
	author: string;
	authorPhoto?: string;
	body: string;
	date: Date;
	likeCount: number;
	pressLike: boolean;
	onLikeClick: (commentId: string) => void;
}

function CommentComponent({
	id,
	author,
	authorPhoto,
	body,
	date,
	likeCount,
	pressLike,
	onLikeClick,
}: ICommentComponent) {
	const photoSrc = authorPhoto
		? resolveMediaUrl(authorPhoto)
		: DEFAULT_PROFILE_IMAGE;

	return (
		<div className="flex pt-[12px]">
			<div className="w-[32px] h-[32px] mr-[12px] flex-shrink-0">
				<ProfileImageButton image={photoSrc} />
			</div>
			<div className="flex-grow">
				<div className="flex flex-grow justify-between items-start leading-[14px] text-[14px]">
					<div>
						<span className="font-bold text-black mr-[4px]">
							{author}
						</span>
						{body}
					</div>
					<div>
						<LikeIcon
							className={
								"cursor-pointer " +
								(pressLike ? "text-[rgb(255,48,64)]" : "")
							}
							onClick={() => onLikeClick(id)}
						/>
					</div>
				</div>
				<div>
					<span className="text-[12px] leading-[16px] text-[rgb(115,115,115)] mr-[6px]">
						{date.toString()}
					</span>
					{likeCount > 0 && (
						<span className="text-[12px] leading-[16px] font-semibold text-[rgb(115,115,115)] mr-[6px]">
							좋아요 {likeCount}개
						</span>
					)}
					<span className="text-[12px] leading-[16px] font-semibold text-[rgb(115,115,115)]">
						<s>답글달기</s>
					</span>
				</div>
			</div>
		</div>
	);
}

export default CommentComponent;
