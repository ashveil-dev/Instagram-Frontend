import { useCallback, useState } from "react";
import SearchIcon from "@/assets/images/icons/search.svg?react";
import ProfileButton from "@/atoms/button/ProfileButton";
import ProfileImage from "./360035642_812561723859722_2543718457893992700_n.jpg";

type ProfileType = {
	image: string;
	nickName: string;
	fullName: string;
	follower?: string;
};

const Profiles: ProfileType[] = [
	{
		image: ProfileImage,
		nickName: "aaa_stories",
		fullName: "A.A.A",
	},
	{
		image: ProfileImage,
		nickName: "aaa111ys",
		fullName: "",
	},
	{
		image: ProfileImage,
		nickName: "aaram_jo",
		fullName: "조아람둥",
	},
	{
		image: ProfileImage,
		nickName: "010_aaa",
		fullName: "",
	},
	{
		image: ProfileImage,
		nickName: "aaaangd",
		fullName: "더 앙드/원장 정민정",
	},
	{
		image: ProfileImage,
		nickName: "a_arang_",
		fullName: "아랑",
	},
];

function Search() {
	const [searchValue, setSearchValue] = useState("");
	const [isClicked, setIsClicked] = useState(false);

	const ButtonOnFocus = useCallback(() => {
		setIsClicked(true);
	}, [setIsClicked]);
	const ButtonOnBlur = useCallback(() => setIsClicked(false), [setIsClicked]);

	return (
		<div>
			<div className="my-[8px] pt-[12px] pb-[36px] pl-[24px] pr-[14px]">
				<span className="font-bold text-[24px]">검색</span>
			</div>
			<div className="mx-[16px] mb-[24px] relative">
				<input
					onFocus={ButtonOnFocus}
					onBlur={ButtonOnBlur}
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					placeholder={isClicked ? "검색" : ""}
					className="py-[3px] px-[16px] w-full border-none outline-none bg-[rgb(239,239,239)] rounded-[8px] h-[40px] text-[16px] "
				/>
				{!isClicked && (
					<div className="absolute top-0 bottom-0 left-0 pt-[3px] pl-[16px] flex items-center gap-[12px]">
						<SearchIcon className="text-[#737373] w-[16px] h-[16px] " />
						<span className="text-[#737373] text-[16px] font-light">
							검색
						</span>
					</div>
				)}
			</div>
			<hr />
			{searchValue !== "" ? (
				<div>
					{Profiles.map((profile) => (
						<ProfileButton
							image={profile.image}
							imageWidth="44px"
							imageHeight="44px"
							nickName={profile.nickName}
							fullName={profile.fullName}
							follower={profile.follower}
						/>
					))}
				</div>
			) : (
				<div>
					<div className="mt-[6px] mb-[8px] mx-[24px] pt-[4px] flex justify-between  ">
						<span className="text-[16px] font-bold ">
							최근 검색 항목
						</span>
						<span className="text-[14px] font-bold text-[#0095f6] hover:text-[rgb(0,55,107)] cursor-pointer">
							모두 지우기
						</span>
					</div>
					<div>
						<ProfileButton
							image={ProfileImage}
							imageWidth="44px"
							imageHeight="44px"
							nickName="rjs595959"
							fullName="장동건"
							follower="1만명"
							onRemove={() => {}}
						/>

						<ProfileButton
							image={ProfileImage}
							imageWidth="44px"
							imageHeight="44px"
							nickName="rjs595959"
							fullName="장동건"
							follower="1만명"
							onRemove={() => {}}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

export default Search;
