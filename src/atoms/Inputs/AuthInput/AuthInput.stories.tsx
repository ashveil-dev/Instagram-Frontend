import { useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useArgs } from "@storybook/preview-api";
import AuthInput from "./AuthInput";

const meta = {
	title: "Atoms/AuthInput",
	component: AuthInput,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: `인증 페이지에서 사용하는 인풋 컴포넌트입니다.  
				유효값 검사, 패스워드 형식으로 입력 값을 *로 치환을 지원합니다.					 
					`,
			},
		},
	},
	argTypes: {},
	args: {},
	tags: ["autodocs"],
} satisfies Meta<typeof AuthInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
	args: {
		label: "테스트",
		isValidValue: true,
		useToggleHiding: true,
		value: "",
		onChange: fn(),
	},
	render: function DefaultComponent(args) {
		const [{ value }, updateArgs] = useArgs();
		const onChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				updateArgs({ value: e.target.value });
			},
			[updateArgs]
		);

		return (
			<AuthInput
				label={args.label}
				isValidValue={args.isValidValue}
				useToggleHiding={args.useToggleHiding}
				value={value}
				onChange={onChange}
			/>
		);
	},
};
