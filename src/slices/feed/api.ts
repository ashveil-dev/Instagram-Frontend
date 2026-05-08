import axiosInstance from "@/utils/axios/index";
import { IGetFeedListParams, IGetFeedParams } from "@/utils/types/feed";

export const getFeedListApi = async (params: IGetFeedListParams) => {
	const result = await axiosInstance({
		method: "get",
		url: "/post",
		headers: {
			Authorization: "Bearer " + localStorage.getItem("accessToken"),
		},
		params,
	});

	return result.data;
};

export const uploadFeedApi = async (data: FormData) => {
	const result = await axiosInstance({
		method: "post",
		url: "/post",
		headers: {
			Authorization: "Bearer " + localStorage.getItem("accessToken"),
		},
		data,
	});

	return result.data;
};

export const getFeedApi = async (params: IGetFeedParams) => {
	const result = await axiosInstance({
		method: "get",
		url: "/post/" + params.id,
		headers: {
			Authorization: "Bearer " + localStorage.getItem("accessToken"),
		},
	});

	return result.data;
};
