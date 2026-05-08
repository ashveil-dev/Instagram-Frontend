import Menu from "@/containers/common/Menu/Menu";
import FeedListContainer from "@/containers/home/FeedList";

function HomePage() {
	return (
		<div className="flex w-full overflow-y-hidden h-dvh">
			<Menu />

			<main className="flex justify-center flex-grow overflow-y-scroll">
				<FeedListContainer />
				{/* <div className="pl-[64px] mt-[36px]">
					<Recommendation />
				</div> */}
			</main>
		</div>
	);
}

export default HomePage;
