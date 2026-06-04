import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
	modal: string | null;
	slideMenu: string;
	detailMenu: boolean;
}

const initialState: IInitialState = {
	modal: null,
	slideMenu: "",
	detailMenu: false,
};

const viewSlice = createSlice({
	name: "view",
	initialState,
	reducers: {
		setModal: (state, action: PayloadAction<typeof initialState.modal>) => {
			state.modal = action.payload;
		},
		setSlideMenu: (
			state,
			action: PayloadAction<typeof initialState.slideMenu>
		) => {
			state.slideMenu = action.payload;
		},
		toggleDetailMenu: (state) => {
			state.detailMenu = !state.detailMenu;
		},
		setDetailMenu: (state, action: PayloadAction<boolean>) => {
			state.detailMenu = action.payload;
		},
	},
});

export const { setModal, setSlideMenu, toggleDetailMenu, setDetailMenu } =
	viewSlice.actions;

export default viewSlice.reducer;
