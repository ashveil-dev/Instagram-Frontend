import { createSlice } from "@reduxjs/toolkit";
import { getFeedListThunk, uploadFeedThunk, getFeedThunk } from "./thunk";
import { IFeedData } from "@/utils/types/feed";

interface IInitialState {
	loading: boolean;
	error?: string;
	feed?: IFeedData;
	feedList: IFeedData[];
}

const initialState: IInitialState = {
	loading: false,
	error: undefined,
	feed: undefined,
	feedList: [],
};

const feedSlice = createSlice({
	name: "view",
	initialState,
	reducers: {
		setFeedList: (state, { payload: { id, field, value } }) => {
			state.feedList = state.feedList.map((feed) => {
				if (feed.id === id)
					return {
						...feed,
						[field]: value,
					};
				return feed;
			});
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(getFeedListThunk.pending, (state) => {
				state.loading = true;
				state.error = undefined;
			})
			.addCase(getFeedListThunk.fulfilled, (state, action) => {
				state.loading = false;

				if (state.feedList.length === 0)
					state.feedList = action.payload.posts;
				else {
					for (let i = 0; i < action.payload.posts.length; i++) {
						if (
							state.feedList[
								state.feedList.length -
									action.payload.posts.length +
									i
							].id !== action.payload.posts[i].id
						)
							state.feedList.push(action.payload.posts[i]);
					}
				}
			})
			.addCase(getFeedListThunk.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(uploadFeedThunk.pending, (state) => {
				state.loading = true;
				state.error = undefined;
			})
			.addCase(uploadFeedThunk.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(uploadFeedThunk.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(getFeedThunk.pending, (state) => {
				state.loading = true;
				state.error = undefined;
			})
			.addCase(getFeedThunk.fulfilled, (state, action) => {
				state.loading = false;
				state.feed = action.payload;
			})
			.addCase(getFeedThunk.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			}),
});

export const { setFeedList } = feedSlice.actions;
export default feedSlice.reducer;
