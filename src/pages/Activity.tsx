import FeedListContainer from "@/containers/home/FeedList";

function ActivityPage() {
	return (
		<div className="w-full max-w-[470px] py-[24px]">
			<h1 className="text-[24px] font-bold mb-[24px] px-[20px]">내 활동</h1>
			<p className="text-[14px] text-[rgb(115,115,115)] px-[20px] mb-[16px]">
				좋아요한 게시물
			</p>
			<FeedListContainer mode="activity" />
		</div>
	);
}

export default ActivityPage;
