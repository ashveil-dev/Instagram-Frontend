import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSuggestionsApi } from "@/slices/user/profileApi";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/profileImages";
import type { IUserSummary } from "@/utils/types/user";
import { resolveMediaUrl } from "@/utils/mediaUrl";
import FeedListContainer from "@/containers/home/FeedList";

function ExplorePage() {
	const [suggestions, setSuggestions] = useState<IUserSummary[]>([]);

	useEffect(() => {
		getSuggestionsApi().then((data) => setSuggestions(data.users));
	}, []);

	return (
		<div className="w-full max-w-[935px] py-[24px] px-[20px]">
			<h1 className="text-[24px] font-bold mb-[24px]">탐색</h1>
			{suggestions.length > 0 && (
				<div className="mb-[32px]">
					<h2 className="text-[16px] font-semibold mb-[16px]">
						회원님을 위한 추천
					</h2>
					<div className="flex gap-[16px] overflow-x-auto pb-[8px]">
						{suggestions.map((user) => (
							<Link
								key={user.id}
								to={`/profile/${user.nickName}`}
								className="flex flex-col items-center min-w-[120px]"
							>
								<div className="w-[80px] h-[80px] rounded-full overflow-hidden mb-[8px]">
									<img
										src={
											user.photo
												? resolveMediaUrl(user.photo)
												: DEFAULT_PROFILE_IMAGE
										}
										alt={user.nickName}
										className="w-full h-full object-cover"
									/>
								</div>
								<span className="text-[14px] font-semibold truncate max-w-[120px]">
									{user.nickName}
								</span>
							</Link>
						))}
					</div>
				</div>
			)}
			<FeedListContainer mode="explore" variant="grid" />
		</div>
	);
}

export default ExplorePage;
