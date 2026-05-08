import { useState, useCallback } from "react";
import { useAppDispatch } from "@/utils/hooks/redux";
import { setModal } from "@/slices/view/slice";
import axiosInstance from "@/utils/axios/index";
import type { IFeedData } from "@/utils/types/feed";
import FeedComponent from "@/components/home/Feed/Feed";
import { getFeedThunk } from "@/slices/feed/thunk";
import { setFeedList } from "@/slices/feed/slice";

interface IFeedContainer {
	feed: IFeedData;
}

function FeedContainer({ feed }: IFeedContainer) {
	const dispatch = useAppDispatch();
	const [comment, setComment] = useState("");

	const likeOnClick = useCallback(async () => {
		try {
			await axiosInstance({
				method: "get",
				url: "/post/like",
				headers: {
					Authorization:
						"Bearer " + localStorage.getItem("accessToken"),
				},
				params: {
					id: feed.id,
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
		} catch (e) {
			console.log(e);
		}
	}, [feed, dispatch]);

	const commentOnClick = useCallback(() => {
		dispatch(getFeedThunk({ id: feed.id }));
		dispatch(setModal("showDetailFeed"));
	}, [dispatch, feed]);

	const commentOnChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setComment(e.target.value);
		},
		[]
	);

	const commentOnSubmit = useCallback(
		async (e?: React.FormEvent) => {
			e?.preventDefault();

			try {
				await axiosInstance({
					method: "post",
					url: "/comment",
					headers: {
						Authorization:
							"Bearer " + localStorage.getItem("accessToken"),
					},
					data: {
						id: feed.id,
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

	return (
		<FeedComponent
			feed={feed}
			comment={comment}
			likeOnClick={likeOnClick}
			commentOnClick={commentOnClick}
			commentOnChange={commentOnChange}
			commentOnSubmit={commentOnSubmit}
			commentOnKeyDown={commentOnKeyDown}
		/>
	);
}

export default FeedContainer;
