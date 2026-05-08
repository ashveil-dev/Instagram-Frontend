import ProfileImageButton from "@/atoms/button/ProfileImageButton";
import ProfileImage from "@/assets/images/test/profile.jpg";
import LikeIcon from "@/assets/images/icons/like.svg?react";

interface ICommentComponent {
	author: string;
	body: string;
	date: Date;
}

function CommentComponent({ author, body, date }: ICommentComponent) {
	return (
		<div className="flex pt-[12px]">
			<div className="w-[32px] h-[32px] mr-[12px] flex-shrink-0">
				<ProfileImageButton image={ProfileImage} />
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
						<LikeIcon className="cursor-pointer" />
					</div>
				</div>
				<div>
					<span className="text-[12px] leading-[16px] text-[rgb(115,115,115)] mr-[6px]">
						{date.toString()}
					</span>
					<span className="text-[12px] leading-[16px] font-semibold text-[rgb(115,115,115)] mr-[6px]">
						좋아요 49개
					</span>
					<span className="text-[12px] leading-[16px] font-semibold text-[rgb(115,115,115)]">
						<s>답글달기</s>
					</span>
				</div>
			</div>
		</div>
	);
}

export default CommentComponent;
