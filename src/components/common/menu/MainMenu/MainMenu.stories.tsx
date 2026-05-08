import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import MainMenuComponent from "./MainMenu";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Example/MainMenu",
	component: MainMenuComponent,
	tags: ["autodocs"],
} satisfies Meta<typeof MainMenuComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
	args: {
		extend: true,
		buttonOnClick: () => fn(),
		currentClickedButton: "",
	},
};
