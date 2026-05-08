import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/hooks/redux";
import axiosInstance from "@/utils/axios/index";
import DetailFeedComponent from "@/components/modal/detailFeed/DetailFeed";
import { getFeedThunk } from "@/slices/feed/thunk";
import { setFeedList } from "@/slices/feed/slice";

function DetailFeedContainer() {
	const dispatch = useAppDispatch();
	const feed = useAppSelector((state) => state.feed.feed);
	const [comment, setComment] = useState("");

	const commentOnSubmit = useCallback(
		async (e?: React.FormEvent) => {
			e?.preventDefault();
			if (feed === null || feed === undefined) return;

			try {
				await axiosInstance({
					method: "post",
					url: "/comment",
					headers: {
						Authorization:
							"Bearer " + localStorage.getItem("accessToken"),
					},
					data: {
						id: feed?.id,
						body: comment,
					},
				});
				dispatch(
					setFeedList({
						id: feed.id,
						field: "commentCount",
						value: feed.commentCount + 1,
					})
				);
				setComment("");
				dispatch(getFeedThunk({ id: feed?.id }));
			} catch (e) {
				alert("댓글 쓰기에 실패하였습니다.");
				console.log(e);
			}
		},
		[feed, comment, dispatch]
	);

	const commentOnKeyDown = useCallback(
		async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.key === "Enter") {
				if (!e.shiftKey) {
					commentOnSubmit();
				}
			}
		},
		[commentOnSubmit]
	);

	const commentOnChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) =>
			setComment(e.target.value),
		[]
	);

	const likeOnClick = useCallback(async () => {
		if (feed === undefined) return;

		try {
			await axiosInstance({
				method: "get",
				url: "/post/like",
				headers: {
					Authorization:
						"Bearer " + localStorage.getItem("accessToken"),
				},
				params: {
					id: feed?.id,
				},
			});
			dispatch(
				setFeedList({
					id: feed.id,
					field: "likeCount",
					value: feed.pressLike
						? feed.likeCount - 1
						: feed.likeCount + 1,
				})
			);
			dispatch(
				setFeedList({
					id: feed.id,
					field: "pressLike",
					value: !feed.pressLike,
				})
			);
			dispatch(getFeedThunk({ id: feed?.id }));
		} catch (e) {
			console.log(e);
		}
	}, [feed, dispatch]);

	if (feed === undefined) return null;
	return (
		<DetailFeedComponent
			feed={feed}
			likeOnClick={likeOnClick}
			comment={comment}
			commentOnKeyDown={commentOnKeyDown}
			commentOnChange={commentOnChange}
			commentOnSubmit={commentOnSubmit}
		/>
	);
}

export default DetailFeedContainer;
