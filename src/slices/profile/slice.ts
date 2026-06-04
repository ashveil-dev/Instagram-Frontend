import { createSlice } from "@reduxjs/toolkit";
import TypedCreateAsyncThunk from "@/utils/hooks/TypedCreateAsyncThunk";
import {
	followUserApi,
	getMeApi,
	getProfileApi,
	uploadProfilePhotoApi,
} from "@/slices/user/profileApi";
import type { IUserProfile } from "@/utils/types/user";
import { AxiosError } from "axios";

export const fetchMeThunk = TypedCreateAsyncThunk(
	"profile/fetchMeThunk",
	async (_: null, thunkAPI) => {
		try {
			return await getMeApi();
		} catch (e: unknown) {
			if (e instanceof AxiosError) {
				return thunkAPI.rejectWithValue(
					e.response?.data.message ?? "unknown error"
				);
			}
			return thunkAPI.rejectWithValue("unknown error");
		}
	}
);

export const fetchProfileThunk = TypedCreateAsyncThunk(
	"profile/fetchProfileThunk",
	async (nickName: string, thunkAPI) => {
		try {
			return await getProfileApi(nickName);
		} catch (e: unknown) {
			if (e instanceof AxiosError) {
				return thunkAPI.rejectWithValue(
					e.response?.data.message ?? "unknown error"
				);
			}
			return thunkAPI.rejectWithValue("unknown error");
		}
	}
);

export const uploadProfilePhotoThunk = TypedCreateAsyncThunk(
	"profile/uploadProfilePhotoThunk",
	async (file: File, thunkAPI) => {
		try {
			const formData = new FormData();
			formData.append("photo", file);
			return await uploadProfilePhotoApi(formData);
		} catch (e: unknown) {
			if (e instanceof AxiosError) {
				return thunkAPI.rejectWithValue(
					e.response?.data.message ?? "unknown error"
				);
			}
			return thunkAPI.rejectWithValue("unknown error");
		}
	}
);

export const followUserThunk = TypedCreateAsyncThunk(
	"profile/followUserThunk",
	async (id: string, thunkAPI) => {
		try {
			return await followUserApi(id);
		} catch (e: unknown) {
			if (e instanceof AxiosError) {
				return thunkAPI.rejectWithValue(
					e.response?.data.message ?? "unknown error"
				);
			}
			return thunkAPI.rejectWithValue("unknown error");
		}
	}
);

interface IProfileState {
	me?: IUserProfile;
	viewed?: IUserProfile;
	loading: boolean;
	photoUploading: boolean;
	error?: string;
	photoError?: string;
}

const initialState: IProfileState = {
	me: undefined,
	viewed: undefined,
	loading: false,
	photoUploading: false,
	error: undefined,
	photoError: undefined,
};

const profileSlice = createSlice({
	name: "profile",
	initialState,
	reducers: {
		clearViewedProfile: (state) => {
			state.viewed = undefined;
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(fetchMeThunk.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchMeThunk.fulfilled, (state, action) => {
				state.loading = false;
				state.me = { ...action.payload, isMe: true };
			})
			.addCase(fetchMeThunk.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(fetchProfileThunk.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchProfileThunk.fulfilled, (state, action) => {
				state.loading = false;
				state.viewed = action.payload;
			})
			.addCase(fetchProfileThunk.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(followUserThunk.fulfilled, (state, action) => {
				if (state.viewed) {
					state.viewed.isFollowing = action.payload.isFollowing;
					state.viewed.follower = action.payload.follower;
				}
			})
			.addCase(uploadProfilePhotoThunk.pending, (state) => {
				state.photoUploading = true;
				state.photoError = undefined;
			})
			.addCase(uploadProfilePhotoThunk.fulfilled, (state, action) => {
				state.photoUploading = false;
				if (state.me) {
					state.me.photo = action.payload.photo;
				}
			})
			.addCase(uploadProfilePhotoThunk.rejected, (state, action) => {
				state.photoUploading = false;
				state.photoError = action.payload;
			}),
});

export const { clearViewedProfile } = profileSlice.actions;
export default profileSlice.reducer;
