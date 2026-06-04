import { useCallback, useState } from "react";
import SearchIcon from "@/assets/images/icons/search.svg?react";
import ProfileButton from "@/atoms/button/ProfileButton";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/profileImages";
import type { IUserSummary } from "@/utils/types/user";
import { resolveMediaUrl } from "@/utils/mediaUrl";

interface ISearch {
	searchValue: string;
	onSearchChange: (value: string) => void;
	results: IUserSummary[];
	recent: IUserSummary[];
	onClearRecent: () => void;
	onProfileClick: (user: IUserSummary) => () => void;
	onRemoveRecent: (id: string) => void;
	onMessageClick: (user: IUserSummary) => () => void;
}

function Search({
	searchValue,
	onSearchChange,
	results,
	recent,
	onClearRecent,
	onProfileClick,
	onRemoveRecent,
	onMessageClick,
}: ISearch) {
	const [isClicked, setIsClicked] = useState(false);

	const ButtonOnFocus = useCallback(() => setIsClicked(true), []);
	const ButtonOnBlur = useCallback(() => setIsClicked(false), []);

	const list = searchValue !== "" ? results : recent;

	return (
		<div className="w-full min-w-0">
			<div className="my-[8px] pt-[12px] pb-[36px] pl-[24px] pr-[14px]">
				<span className="font-bold text-[24px]">검색</span>
			</div>
			<div className="mx-[16px] mb-[24px] relative">
				<input
					onFocus={ButtonOnFocus}
					onBlur={ButtonOnBlur}
					value={searchValue}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder={isClicked ? "검색" : ""}
					className="py-[3px] px-[16px] w-full border-none outline-none bg-[rgb(239,239,239)] rounded-[8px] h-[40px] text-[16px] "
				/>
				{!isClicked && (
					<div className="absolute top-0 bottom-0 left-0 pt-[3px] pl-[16px] flex items-center gap-[12px] pointer-events-none">
						<SearchIcon className="text-[#737373] w-[16px] h-[16px] " />
						<span className="text-[#737373] text-[16px] font-light">
							검색
						</span>
					</div>
				)}
			</div>
			<hr />
			{searchValue === "" && recent.length > 0 && (
				<div className="mt-[6px] mb-[8px] mx-[24px] pt-[4px] flex justify-between">
					<span className="text-[16px] font-bold ">최근 검색 항목</span>
					<button
						type="button"
						onClick={onClearRecent}
						className="text-[14px] font-bold text-[#0095f6] hover:text-[rgb(0,55,107)] cursor-pointer border-none bg-transparent"
					>
						모두 지우기
					</button>
				</div>
			)}
			<div>
				{list.map((profile) => (
					<div key={profile.id} className="flex items-center">
						<div
							className="flex-grow"
							onClick={onProfileClick(profile)}
						>
							<ProfileButton
								image={
									profile.photo
										? resolveMediaUrl(profile.photo)
										: DEFAULT_PROFILE_IMAGE
								}
								imageWidth="44px"
								imageHeight="44px"
								nickName={profile.nickName}
								fullName={profile.fullName}
								follower={
									profile.follower
										? `${profile.follower}명`
										: undefined
								}
							/>
						</div>
						{searchValue !== "" && (
							<button
								type="button"
								onClick={onMessageClick(profile)}
								className="mr-[16px] text-[12px] font-semibold text-[#0095f6]"
							>
								메시지
							</button>
						)}
						{searchValue === "" && (
							<button
								type="button"
								onClick={() => onRemoveRecent(profile.id)}
								className="mr-[24px] text-[#737373] text-[20px] border-none bg-transparent cursor-pointer"
								aria-label="삭제"
							>
								×
							</button>
						)}
					</div>
				))}
				{searchValue !== "" && results.length === 0 && (
					<p className="px-[24px] py-[16px] text-[14px] text-[#737373]">
						검색 결과가 없습니다.
					</p>
				)}
			</div>
		</div>
	);
}

export default Search;
