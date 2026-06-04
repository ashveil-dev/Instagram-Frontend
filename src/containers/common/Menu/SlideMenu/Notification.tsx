import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/utils/hooks/redux";
import NotificationComponent from "@/components/common/menu/SlideMenu/slide/Notification/Notification";
import {
	followUserApi,
	getNotificationsApi,
} from "@/slices/user/profileApi";
import { getFeedThunk } from "@/slices/feed/thunk";
import { setModal, setSlideMenu } from "@/slices/view/slice";
import type { INotificationItem } from "@/utils/types/user";

function NotificationContainer() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const slideMenu = useAppSelector((state) => state.view.slideMenu);
	const [items, setItems] = useState<INotificationItem[]>([]);
	const [followingIds, setFollowingIds] = useState<Record<string, boolean>>(
		{}
	);

	const loadNotifications = useCallback(() => {
		getNotificationsApi().then((data) => setItems(data.notifications));
	}, []);

	useEffect(() => {
		if (slideMenu === "notification") {
			loadNotifications();
		}
	}, [slideMenu, loadNotifications]);

	const followOnClick = useCallback(
		(authorId: string, author: string) => async () => {
			const result = await followUserApi(authorId);
			setFollowingIds((prev) => ({
				...prev,
				[author]: result.isFollowing,
			}));
		},
		[]
	);

	const notificationOnClick = useCallback(
		(item: INotificationItem) => () => {
			if (item.type === "follow") {
				navigate(`/profile/${item.author}`);
				return;
			}
			if (item.type === "message") {
				dispatch(setSlideMenu(""));
				navigate("/direct", {
					state: { conversationId: item.conversationId },
				});
				return;
			}
			if (item.postId) {
				dispatch(setSlideMenu(""));
				dispatch(getFeedThunk({ id: item.postId }));
				dispatch(setModal("showDetailFeed"));
			}
		},
		[dispatch, navigate]
	);

	return (
		<NotificationComponent
			items={items}
			followingIds={followingIds}
			onFollowClick={followOnClick}
			onNotificationClick={notificationOnClick}
		/>
	);
}

export default NotificationContainer;
