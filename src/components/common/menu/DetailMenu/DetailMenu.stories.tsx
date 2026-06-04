import type { Meta, StoryObj } from "@storybook/react";
import DetailMenuComponent from "./DetailMenu";

const noop = () => {};

const meta = {
	title: "Example/DetailMenu",
	component: DetailMenuComponent,
	tags: ["autodocs"],
} satisfies Meta<typeof DetailMenuComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		show: true,
		onSettings: noop,
		onActivity: noop,
		onSaved: noop,
		onTheme: noop,
		onReport: noop,
		onSwitchAccount: noop,
		onLogout: noop,
	},
	render: function Render(args) {
		return (
			<div className="w-[500px] h-[500px]">
				<DetailMenuComponent {...args} />
			</div>
		);
	},
};
