import Section from "./Section";
import type { INotificationItem } from "@/utils/types/user";
import { resolveMediaUrl } from "@/utils/mediaUrl";

interface INotification {
	items: INotificationItem[];
	followingIds: Record<string, boolean>;
	onFollowClick: (authorId: string, author: string) => () => void;
	onNotificationClick: (item: INotificationItem) => () => void;
}

function groupByTerm(items: INotificationItem[]) {
	const groups: Record<string, INotificationItem[]> = {};
	for (const item of items) {
		const term = "최근";
		if (!groups[term]) groups[term] = [];
		groups[term].push(item);
	}
	return groups;
}

function Notification({
	items,
	followingIds,
	onFollowClick,
	onNotificationClick,
}: INotification) {
	const groups = groupByTerm(items);

	return (
		<div className="w-full min-w-0">
			<div className="pt-[16px] pb-[24px] px-[24px] leading-[18px]">
				<span className="font-bold text-[24px]">알림</span>
			</div>
			{items.length === 0 && (
				<p className="px-[24px] text-[14px] text-[#737373]">
					새 알림이 없습니다.
				</p>
			)}
			{Object.entries(groups).map(([term, groupItems], groupIndex) =>
				groupItems.map((item, index) => (
					<div
						key={item.id}
						onClick={onNotificationClick(item)}
						className="cursor-pointer hover:bg-[#fafafa]"
					>
						<Section
							type={item.type}
							term={index === 0 ? term : ""}
							isFirst={groupIndex === 0 && index === 0}
							author={item.author}
							title={
								item.type === "comment" || item.type === "message"
									? undefined
									: item.body
							}
							content={
								item.type === "comment" || item.type === "message"
									? item.body
									: undefined
							}
							pastTime={new Date(
								item.createdAt
							).toLocaleDateString("ko-KR")}
							profileImage={resolveMediaUrl(item.authorPhoto)}
							isFollowing={followingIds[item.author]}
							onFollowClick={onFollowClick(
								item.authorId,
								item.author
							)}
							showFollow={item.type === "follow"}
						/>
					</div>
				))
			)}
		</div>
	);
}

export default Notification;
