import type { Meta, StoryObj } from "@storybook/react";
import Modal from "./Modal";
import { fn } from "@storybook/test";

const meta = {
	title: "common/modal/Modal",
	component: Modal,
	parameters: {},
	args: {
		exitModal: fn(),
		children: <div></div>,
	},
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultMenu: Story = {
	args: {},
};
