import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import { handleMockRequest } from "./handlers";

export const mockAdapter: AxiosAdapter = async (config) => {
	const response = await handleMockRequest(
		config as InternalAxiosRequestConfig
	);
	return {
		...response,
		config: config as InternalAxiosRequestConfig,
	};
};
