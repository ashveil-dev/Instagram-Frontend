import axios from "axios";
import { getApiBaseURL, isMockApiEnabled } from "@/utils/apiBase";
import { mockAdapter } from "@/mock/adapter";

const instance = axios.create({
	baseURL: getApiBaseURL(),
	...(isMockApiEnabled() ? { adapter: mockAdapter } : {}),
});

instance.interceptors.request.use((config) => {
	const accessToken = localStorage.getItem("accessToken");
	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}
	return config;
});

export default instance;
