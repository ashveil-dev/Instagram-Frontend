import TypedCreateAsyncThunk from "@/utils/hooks/TypedCreateAsyncThunk";
import {
	getFeedApi,
	getFeedListApi,
	getProfilePostsApi,
	uploadFeedApi,
	type FeedListEndpoint,
} from "./api";
import {
	IGetFeedListParams,
	IUploadFeedBody,
	IGetFeedParams,
} from "@/utils/types/feed";
import { AxiosError } from "axios";

export const getFeedListThunk = TypedCreateAsyncThunk(
	"feed/getFeedListThunk",
	async (
		params: IGetFeedListParams & { endpoint?: FeedListEndpoint },
		thunkAPI
	) => {
		try {
			const { endpoint = "home", ...query } = params;
			const result = await getFeedListApi(query, endpoint);
			return { ...result, endpoint };
		} catch (e: unknown) {
			if (e instanceof AxiosError) {
				return thunkAPI.rejectWithValue(e.response?.data.message);
			}
			return thunkAPI.rejectWithValue("Unknown Error");
		}
	}
);

export const uploadFeedThunk = TypedCreateAsyncThunk(
	"feed/uploadFeedThunk",
	async ({ caption, files }: IUploadFeedBody, thunkAPI) => {
		try {
			const sendData = new FormData();
			sendData.append("caption", caption);

			if (files !== undefined) {
				for (let i = 0; i < files.length; i++) {
					sendData.append("files", files[i]);
				}
			}

			const result = await uploadFeedApi(sendData);
			return result;
		} catch (e: unknown) {
			if (e instanceof AxiosError) {
				return thunkAPI.rejectWithValue(e.response?.data.message);
			}
			return thunkAPI.rejectWithValue("Unknown Error");
		}
	}
);

export const getProfilePostsThunk = TypedCreateAsyncThunk(
	"feed/getProfilePostsThunk",
	async (
		params: IGetFeedListParams & { nickName: string },
		thunkAPI
	) => {
		try {
			const { nickName, ...query } = params;
			const result = await getProfilePostsApi(nickName, query);
			return result;
		} catch (e: unknown) {
			if (e instanceof AxiosError) {
				return thunkAPI.rejectWithValue(e.response?.data.message);
			}
			return thunkAPI.rejectWithValue("Unknown Error");
		}
	}
);

export const getFeedThunk = TypedCreateAsyncThunk(
	"feed/getFeedThunk",
	async (params: IGetFeedParams, thunkAPI) => {
		try {
			const result = await getFeedApi(params);
			return result;
		} catch (e: unknown) {
			if (e instanceof AxiosError) {
				return thunkAPI.rejectWithValue(e.response?.data.message);
			}
			return thunkAPI.rejectWithValue("Unknown Error");
		}
	}
);
