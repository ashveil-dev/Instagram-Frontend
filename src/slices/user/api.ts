import axiosInstance from "@/utils/axios/index";
import { ICheckData, ILoginData, IRegisterData } from "@/utils/types/user";

export const loginApi = async (data: ILoginData) => {
	const result = await axiosInstance({
		method: "post",
		url: "/user/signIn",
		data,
	});

	return result.data;
};

export const registerApi = async (data: IRegisterData) => {
	const result = await axiosInstance({
		method: "post",
		url: "/user/signUp",
		data,
	});

	return result.data;
};

export const checkApi = async (data: ICheckData) => {
	const result = await axiosInstance({
		method: "post",
		url: "/user/check",
		data: data,
	});

	return result.data;
};
