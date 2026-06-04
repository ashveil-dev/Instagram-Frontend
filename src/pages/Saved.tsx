import FeedListContainer from "@/containers/home/FeedList";

function SavedPage() {
	return (
		<div className="w-full max-w-[935px] py-[24px] px-[20px]">
			<h1 className="text-[24px] font-bold mb-[24px]">저장됨</h1>
			<FeedListContainer mode="saved" variant="grid" />
		</div>
	);
}

export default SavedPage;
