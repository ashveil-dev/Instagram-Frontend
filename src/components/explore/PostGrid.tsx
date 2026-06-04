import { useAppDispatch } from "@/utils/hooks/redux";
import { getFeedThunk } from "@/slices/feed/thunk";
import { setModal } from "@/slices/view/slice";
import type { IFeedData } from "@/utils/types/feed";
import { resolveMediaUrl, isVideoMediaUrl } from "@/utils/mediaUrl";

interface IPostGrid {
	posts: IFeedData[];
	endOfPageRef?: React.RefObject<HTMLDivElement>;
}

function PostGrid({ posts, endOfPageRef }: IPostGrid) {
	const dispatch = useAppDispatch();

	const openPost = (id: string) => {
		dispatch(getFeedThunk({ id }));
		dispatch(setModal("showDetailFeed"));
	};

	return (
		<div className="grid grid-cols-3 gap-[4px]">
			{posts.map((post) => {
				const thumb = post.contents?.[0];
				if (!thumb) return null;
				const src = resolveMediaUrl(thumb);
				return (
					<button
						key={post.id}
						type="button"
						onClick={() => openPost(post.id)}
						className="relative aspect-square bg-black overflow-hidden cursor-pointer group"
					>
						{isVideoMediaUrl(thumb) ? (
							<video
								src={src}
								className="w-full h-full object-cover"
								muted
							/>
						) : (
							<img
								src={src}
								alt=""
								className="w-full h-full object-cover"
							/>
						)}
						<div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-[16px] text-white font-bold text-[16px]">
							<span>♥ {post.likeCount}</span>
							<span>💬 {post.commentCount}</span>
						</div>
					</button>
				);
			})}
			{endOfPageRef && <div ref={endOfPageRef} className="col-span-3 h-[1px]" />}
		</div>
	);
}

export default PostGrid;
