import { useEffect, useState, useRef } from "react";
import FeedListComponent from "@/components/home/FeedList/FeedList";
import { useAppDispatch, useAppSelector } from "@/utils/hooks/redux";
import { getFeedListThunk } from "@/slices/feed/thunk";

function FeedListContainer() {
	const lock = useRef(false);
	const endOfPageRef = useRef<HTMLDivElement>(null);
	const [count, setCount] = useState(0);
	const dispatch = useAppDispatch();
	const loading = useAppSelector((state) => state.feed.loading);
	const error = useAppSelector((state) => state.feed.error);
	const feedList = useAppSelector((state) => state.feed.feedList);

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
				if (error !== "There is no feeds")
					setCount((_count) => _count + 1);
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
	}, [dispatch, error, loading]);

	useEffect(() => {
		dispatch(getFeedListThunk({ max: 2, count }));
	}, [dispatch, count]);

	return (
		<FeedListComponent feedList={feedList} endOfPageRef={endOfPageRef} />
	);
}

export default FeedListContainer;
