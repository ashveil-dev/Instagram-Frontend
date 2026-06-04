import { useEffect, useState, useRef } from "react";
import FeedListComponent from "@/components/home/FeedList/FeedList";
import PostGrid from "@/components/explore/PostGrid";
import { useAppDispatch, useAppSelector } from "@/utils/hooks/redux";
import {
	getFeedListThunk,
	getProfilePostsThunk,
} from "@/slices/feed/thunk";
import { resetFeedList } from "@/slices/feed/slice";
import type { FeedListEndpoint } from "@/slices/feed/api";

interface IFeedListContainer {
	mode?: FeedListEndpoint | "profile";
	nickName?: string;
	variant?: "feed" | "grid";
}

function FeedListContainer({
	mode = "home",
	nickName,
	variant = "feed",
}: IFeedListContainer) {
	const lock = useRef(false);
	const endOfPageRef = useRef<HTMLDivElement>(null);
	const [count, setCount] = useState(1);
	const dispatch = useAppDispatch();
	const loading = useAppSelector((state) => state.feed.loading);
	const error = useAppSelector((state) => state.feed.error);
	const feedList = useAppSelector((state) => state.feed.feedList);

	useEffect(() => {
		dispatch(resetFeedList());
		setCount(1);
		lock.current = false;
	}, [dispatch, mode, nickName]);

	useEffect(() => {
		const element = endOfPageRef.current;
		const config = {
			root: null,
			rootMargin: "0px",
			threshold: 1.0,
		};

		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting === false) {
				lock.current = false;
			}
			if (entries[0].isIntersecting && !lock.current) {
				lock.current = true;
				if (error !== "There are no posts") {
					setCount((_count) => _count + 1);
				}
			}
		}, config);

		if (element) {
			observer.observe(element);
		}

		return () => {
			if (element) {
				observer.unobserve(element);
			}
		};
	}, [error, loading]);

	useEffect(() => {
		if (mode === "profile" && nickName) {
			dispatch(getProfilePostsThunk({ max: 9, count: count - 1, nickName }));
		} else if (mode !== "profile") {
			dispatch(
				getFeedListThunk({
					max: mode === "home" ? 2 : 9,
					count: count - 1,
					endpoint: mode,
				})
			);
		}
	}, [dispatch, count, mode, nickName]);

	if (variant === "grid") {
		return <PostGrid posts={feedList} endOfPageRef={endOfPageRef} />;
	}

	return (
		<FeedListComponent feedList={feedList} endOfPageRef={endOfPageRef} />
	);
}

export default FeedListContainer;
