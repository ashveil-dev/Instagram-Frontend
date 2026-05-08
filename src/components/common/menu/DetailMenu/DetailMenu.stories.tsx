import type { Meta, StoryObj } from "@storybook/react";
import DetailMenuComponent from "./DetailMenu";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Example/DetailMenu",
	component: DetailMenuComponent,
	tags: ["autodocs"],
} satisfies Meta<typeof DetailMenuComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
	args: { show: true },
	render: function Render(args) {
		return (
			<div className="w-[500px] h-[500px]">
				<DetailMenuComponent show={args.show} />
			</div>
		);
	},
};
