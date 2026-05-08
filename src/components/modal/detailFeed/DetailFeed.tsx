import { useState } from "react";
import type { IFeedData } from "@/utils/types/feed";
import CommentComponent from "./Comment";
import MediaSlide from "@/components/home/Feed/MediaSlide";
import ProfileImageButton from "@/atoms/button/ProfileImageButton";
import ProfileImage from "@/assets/images/test/profile.jpg";
import MoreIcon from "@/assets/images/icons/more.svg";
import HeartIcon from "@/assets/images/icons/heart.svg";
import HeartFilledIcon from "@/assets/images/icons/heart_fill.svg?react";
import MessageIcon from "@/assets/images/icons/message.svg";
import DirectIcon from "@/assets/images/icons/direct.svg";
import BookmarkIcon from "@/assets/images/icons/bookmark.svg";

interface IDetailFeedComponent {
	feed: IFeedData;
	comment: string;
	likeOnClick: () => void;
	commentOnChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	commentOnSubmit: (e: React.FormEvent) => void;
	commentOnKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

function DetailFeedComponent({
	feed,
	comment,
	likeOnClick,
	commentOnChange,
	commentOnSubmit,
	commentOnKeyDown,
}: IDetailFeedComponent) {
	const [more, setMore] = useState(false);

	return (
		<div className="flex items-center justify-center">
			<div className="flex w-full h-full max-w-[calc(100vw-128px)] max-h-[calc(100vh-40px)] rounded-[4px] bg-white">
				<div className="max-w-[871px] max-h-[871px] basis-[871px] flex-grow flex-shrink bg-black min-h-[450px]  overflow-hidden">
					<MediaSlide
						width="100%"
						height="100%"
						mediaArray={feed.contents}
					/>
				</div>
				<div className="max-w-[500px] min-w-[405px] flex-shrink-[2] flex flex-col flex-grow bg-white ">
					<div className="p-[14px_16px] flex items-center border-b border-b-[rgb(239,239,239)]">
						<div className="mr-[12px]">
							<div className="w-[32px] h-[32px]">
								<ProfileImageButton image={ProfileImage} />
							</div>
						</div>
						<div className="flex-grow">
							<span className="font-semibold text-[14px] leading-[18px]">
								{feed.author}
							</span>
						</div>
						<div className="ml-[8px] cursor-pointer">
							<img src={MoreIcon} width={24} height={24} />
						</div>
					</div>
					<div className="flex-grow overflow-y-scroll px-[16px] border-b border-b-[rgb(239,239,239)]">
						<div className="flex  mt-[8px] leading-[14px] text-[14px] mb-[15px]">
							<div className="mr-[12px]">
								<div className="w-[32px] h-[32px]">
									<ProfileImageButton image={ProfileImage} />
								</div>
							</div>
							<div className="border-b border-b-gray-200 ">
								<div
									className={
										more
											? undefined
											: "h-[24px] overflow-y-hidden"
									}
								>
									<span className="font-semibold mr-[4px] flex-shrink-0 ">
										{feed.author}
									</span>

									<span
										className={
											"leading-[20px] " +
											(more
												? "h-auto overflow-x-visible overflow-y-visible text-wrap"
												: "w-full overflow-x-hidden overflow-y-hidden text-ellipsis")
										}
									>
										{feed.caption}
									</span>
								</div>

								{!more && (
									<div
										className="mt-[4px] text-[rgb(115,115,115)] cursor-pointer flex-shrink-0"
										onClick={() => {
											setMore(true);
										}}
									>
										... 더 보기
									</div>
								)}
								<div className="mt-[8px] mb-[4px] font-normal text-[12px] leading-[16px] text-[rgb(115,115,115)] w-full flex-shrink-0">
									1일
								</div>
							</div>
						</div>

						{feed.comments?.map((comment) => (
							<CommentComponent
								key={comment.id}
								author={comment.author}
								body={comment.body}
								date={comment.modificationDate}
							/>
						))}
					</div>

					<div className="px-[16px]">
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
											<img
												src={HeartIcon}
												width={24}
												height={24}
											/>
										)}
									</div>
									<div className="p-[8px] cursor-pointer">
										<img
											src={MessageIcon}
											width={24}
											height={24}
										/>
									</div>
									<div className="p-[8px] cursor-pointer">
										<img
											src={DirectIcon}
											width={24}
											height={24}
										/>
									</div>
								</div>
								<div>
									<div className="p-[8px] cursor-pointer">
										<img
											src={BookmarkIcon}
											width={24}
											height={24}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="mb-[10px]">
							<div className="leading-[18px] text-[14px] font-bold ">
								좋아요 {feed.likeCount}개
							</div>
							<div>
								<div className="font-normal text-[12px] text-[rgb(115,115,115)]">
									1일 전
								</div>
							</div>
						</div>
					</div>
					<div className="w-full px-[16px] pb-[10px] border-t border-b-[rgb(219,219,219)]">
						<form
							className="mt-[8px] relative flex text-[14px] "
							onSubmit={commentOnSubmit}
						>
							<textarea
								style={{
									height: `${comment.split("\n").length * 20}px`,
								}}
								value={comment}
								placeholder="댓글 달기"
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
			</div>
		</div>
	);
}

export default DetailFeedComponent;
