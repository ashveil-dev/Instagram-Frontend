import axiosInstance from "@/utils/axios/index";

export const searchUsersApi = async (q: string) => {
	const result = await axiosInstance({
		method: "get",
		url: "/user/search",
		params: { q },
	});
	return result.data;
};

export const getSuggestionsApi = async () => {
	const result = await axiosInstance({
		method: "get",
		url: "/user/suggestions",
	});
	return result.data;
};

export const getMeApi = async () => {
	const result = await axiosInstance({
		method: "get",
		url: "/user/me",
	});
	return result.data;
};

export const getProfileApi = async (nickName: string) => {
	const result = await axiosInstance({
		method: "get",
		url: `/user/profile/${nickName}`,
	});
	return result.data;
};

export const uploadProfilePhotoApi = async (data: FormData) => {
	const result = await axiosInstance({
		method: "post",
		url: "/user/photo",
		data,
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return result.data;
};

export const followUserApi = async (id: string) => {
	const result = await axiosInstance({
		method: "post",
		url: "/user/follow",
		data: { id },
	});
	return result.data;
};

export const getNotificationsApi = async () => {
	const result = await axiosInstance({
		method: "get",
		url: "/notification",
	});
	return result.data;
};

export const getConversationsApi = async () => {
	const result = await axiosInstance({
		method: "get",
		url: "/message/conversations",
	});
	return result.data;
};

export const createConversationApi = async (recipientId: string) => {
	const result = await axiosInstance({
		method: "post",
		url: "/message/conversations",
		data: { recipientId },
	});
	return result.data;
};

export const getMessagesApi = async (conversationId: string) => {
	const result = await axiosInstance({
		method: "get",
		url: `/message/conversations/${conversationId}/messages`,
	});
	return result.data;
};

export const sendMessageApi = async (
	conversationId: string,
	body: string
) => {
	const result = await axiosInstance({
		method: "post",
		url: `/message/conversations/${conversationId}/messages`,
		data: { body },
	});
	return result.data;
};
