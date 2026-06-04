import axiosInstance from "@/utils/axios/index";
import { IGetFeedListParams, IGetFeedParams } from "@/utils/types/feed";

export type FeedListEndpoint =
	| "home"
	| "explore"
	| "reels"
	| "saved"
	| "activity";

const feedListPaths: Record<FeedListEndpoint, string> = {
	home: "/post",
	explore: "/post/explore",
	reels: "/post/reels",
	saved: "/post/saved",
	activity: "/post/activity",
};

export const getFeedListApi = async (
	params: IGetFeedListParams,
	endpoint: FeedListEndpoint = "home"
) => {
	const result = await axiosInstance({
		method: "get",
		url: feedListPaths[endpoint],
		params,
	});

	return result.data;
};

export const getProfilePostsApi = async (
	nickName: string,
	params: IGetFeedListParams
) => {
	const result = await axiosInstance({
		method: "get",
		url: `/user/profile/${nickName}/posts`,
		params,
	});

	return result.data;
};

export const toggleSavePostApi = async (id: string) => {
	const result = await axiosInstance({
		method: "get",
		url: "/post/save",
		params: { id },
	});

	return result.data;
};

export const uploadFeedApi = async (data: FormData) => {
	const result = await axiosInstance({
		method: "post",
		url: "/post",
		data,
	});

	return result.data;
};

export const getFeedApi = async (params: IGetFeedParams) => {
	const result = await axiosInstance({
		method: "get",
		url: "/post/" + params.id,
	});

	return result.data;
};

export const likePostApi = async (id: string) => {
	const result = await axiosInstance({
		method: "get",
		url: "/post/like",
		params: { id },
	});

	return result.data;
};
