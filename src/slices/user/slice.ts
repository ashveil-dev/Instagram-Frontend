import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { checkThunk, loginThunk, registerThunk } from "./thunk";

interface IInitialState {
	isLogin: boolean;
	loading: boolean;
	error: {
		login? : string;
		register? : string;
		check? : string;
	};
}

const initialState: IInitialState = {
	isLogin: false,
	loading: false,
	error: {
		login : undefined,
		register : undefined,
		check : undefined
	},
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setIsLogin: (state, action: PayloadAction<boolean>) => {
			const accessToken = localStorage.getItem("accessToken");
			const refreshToken = localStorage.getItem("refreshToken");

			if (action.payload && accessToken && refreshToken)
				state.isLogin = true;
			if (!action.payload) {
				localStorage.removeItem("accessToken");
				localStorage.removeItem("refreshToken");
				state.isLogin = false;
			}
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(loginThunk.pending, (state) => {
				state.loading = true;
				state.error.login = undefined;
			})
			.addCase(loginThunk.fulfilled, (state, action) => {
				state.loading = false;
				state.isLogin = true;

				localStorage.setItem("accessToken", action.payload.accessToken);
				localStorage.setItem(
					"refreshToken",
					action.payload.refreshToken
				);
			})
			.addCase(loginThunk.rejected, (state, action) => {
				state.loading = false;
				state.error.login = action.payload;
			})
			.addCase(registerThunk.pending, (state) => {
				state.loading = true;
				state.error.register = undefined;
			})
			.addCase(registerThunk.fulfilled, (state, action) => {
				state.loading = false;
				state.isLogin = true;

				localStorage.setItem("accessToken", action.payload.accessToken);
				localStorage.setItem(
					"refreshToken",
					action.payload.refreshToken
				);
			})
			.addCase(registerThunk.rejected, (state, action) => {
				state.loading = false;
				state.error.register = action.payload;
			})
			.addCase(checkThunk.pending, (state) => {
				state.loading = true;
				state.error.check = undefined;
			})
			.addCase(checkThunk.fulfilled, (state, action) => {
				state.loading = false;
				state.isLogin = true;

				localStorage.setItem("accessToken", action.payload.accessToken);
			})
			.addCase(checkThunk.rejected, (state, action) => {
				state.loading = false;
				state.isLogin = false;
				state.error.check = action.payload;

				localStorage.removeItem("accessToken");
				localStorage.removeItem("refreshToken");
			}),
});

export const { setIsLogin } = userSlice.actions;
export default userSlice.reducer;
