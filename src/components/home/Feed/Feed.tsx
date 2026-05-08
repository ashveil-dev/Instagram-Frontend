import { useState } from "react";
import { IFeedData } from "@/utils/types/feed";
import ProfileImageButton from "@/atoms/button/ProfileImageButton";
import ProfileImage from "@/assets/images/test/profile.jpg";
import MoreIcon from "@/assets/images/icons/more.svg";
import HeartIcon from "@/assets/images/icons/heart.svg";
import HeartFilledIcon from "@/assets/images/icons/heart_fill.svg?react";
import MessageIcon from "@/assets/images/icons/message.svg";
import DirectIcon from "@/assets/images/icons/direct.svg";
import BookmarkIcon from "@/assets/images/icons/bookmark.svg";
import ImageSlideComponent from "./MediaSlide";

interface IFeedComponent {
	feed: IFeedData;
	comment: string;
	likeOnClick: () => void;
	commentOnClick: () => void;
	commentOnChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	commentOnSubmit: (e?: React.FormEvent) => void;
	commentOnKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

function Feed({
	feed,
	comment,
	likeOnClick,
	commentOnClick,
	commentOnChange,
	commentOnSubmit,
	commentOnKeyDown,
}: IFeedComponent) {
	const [more, setMore] = useState(false);

	return (
		<div className="w-[min(100vw, 470px)] mb-[20px]">
			<div className="pb-[12px] flex items-center">
				<div className="mr-[12px]">
					<div className="w-[32px] h-[32px]">
						<ProfileImageButton image={ProfileImage} />
					</div>
				</div>
				<div className="flex-grow">
					<span className="font-semibold text-[14px] leading-[18px]">
						{feed.author}
					</span>
					<span className="font-normal text-[14px] text-[rgb(115,115,115)] mx-[4px]">
						•
					</span>
					<span className="font-normal text-[14px] text-[rgb(115,115,115)]">
						1일
					</span>
				</div>
				<div className="ml-[8px] cursor-pointer">
					<img src={MoreIcon} width={24} height={24} />
				</div>
			</div>
			<ImageSlideComponent
				width="468px"
				height="468px"
				mediaArray={feed.contents}
			/>
			<div className="w-full">
				<div className="flex justify-between my-[4px] ml-[-8px]">
					<div className="flex">
						<div
							className="p-[8px] cursor-pointer"
							onClick={likeOnClick}
						>
							{feed.pressLike ? (
								<HeartFilledIcon className="w-[24px] h-[24px] text-[rgb(255,48,64)]" />
							) : (
								<img src={HeartIcon} width={24} height={24} />
							)}
						</div>
						<div
							className="p-[8px] cursor-pointer"
							onClick={commentOnClick}
						>
							<img src={MessageIcon} width={24} height={24} />
						</div>
						<div className="p-[8px] cursor-pointer">
							<img src={DirectIcon} width={24} height={24} />
						</div>
					</div>
					<div>
						<div className="p-[8px] cursor-pointer">
							<img src={BookmarkIcon} width={24} height={24} />
						</div>
					</div>
				</div>
			</div>
			<div className="leading-[18px] text-[14px] font-bold ">
				좋아요 {feed.likeCount}개
			</div>
			<div className="flex mt-[8px] leading-[14px] text-[14px]">
				<div className="font-semibold mr-[4px]">{feed.author}</div>
				<div className="flex flex-grow">
					<div
						className={
							more
								? "h-auto overflow-x-visible overflow-y-visible text-wrap"
								: "h-[14px] overflow-x-hidden overflow-y-hidden text-ellipsis"
						}
					>
						{feed.caption}
					</div>
					{!more && (
						<div
							className="text-[rgb(115,115,115)] cursor-pointer flex-shrink-0"
							onClick={() => {
								setMore(true);
							}}
						>
							... 더 보기
						</div>
					)}
				</div>
			</div>
			{feed.commentCount !== 0 && (
				<div
					className="flex mt-[8px] leading-[18px] text-[14px] text-[rgb(115,115,115)] cursor-pointer"
					onClick={commentOnClick}
				>
					<div>댓글 {feed.commentCount}개 모두 보기</div>
				</div>
			)}
			<div className="w-full pb-[10px] border-b border-b-[rgb(219,219,219)]">
				<form
					onSubmit={commentOnSubmit}
					className="mt-[8px] relative flex text-[14px] "
				>
					<textarea
						style={{
							height: `${comment.split("\n").length * 20}px`,
						}}
						value={comment}
						placeholder="댓글 입력하기"
						onChange={commentOnChange}
						onKeyDown={commentOnKeyDown}
						className="flex-grow outline-none border-none leading-[18px] resize-none max-h-[100px] min-h-[20px]"
					/>
					<button type="submit">
						<span className="font-bold  text-[rgb(0,149,246)]  flex items-center">
							게시
						</span>
					</button>
				</form>
			</div>
		</div>
	);
}

export default Feed;
