import axiosInstance from "@/utils/axios/index";

export interface ICreateCommentBody {
	id: string;
	body: string;
}

export const createCommentApi = async (data: ICreateCommentBody) => {
	const result = await axiosInstance({
		method: "post",
		url: "/comment",
		data,
	});

	return result.data;
};

export const likeCommentApi = async (id: string) => {
	const result = await axiosInstance({
		method: "get",
		url: "/comment/like",
		params: { id },
	});

	return result.data;
};
