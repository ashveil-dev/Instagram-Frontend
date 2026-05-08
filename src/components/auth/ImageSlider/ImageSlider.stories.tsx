import type { Meta, StoryObj } from "@storybook/react";
import ImageSlider from "./ImageSlider";

const meta = {
	title: "Auth/ImageSlider",
	component: ImageSlider,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: `단순한 정적 슬라이드입니다.  
				3초 간격으로 투명도가 활성화/비활성화되면서 슬라이드 움직입니다.
					`,
			},
		},
	},
	argTypes: {},
	args: {},
	tags: ["autodocs"],
} satisfies Meta<typeof ImageSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
	args: {
		opacityIndex: 0,
	},
};
