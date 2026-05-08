import { useCallback, useMemo } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useArgs } from "@storybook/preview-api";
import LoginForm from "./LoginForm";
import errors from "@/utils/data/errors";

const meta = {
	title: "auth/LoginForm",
	component: LoginForm,
	tags: ["autodocs"],
	parameters: {},
	args: {},
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultLoginForm: Story = {
	args: {
		rules: { id: true, password: true, all: true },
		inputs: { id: "", password: "" },
		errorMessage: "Input is invalid",
		inputOnChange: fn(),
		submitOnClick: fn(),
		registerButtonOnClick: fn(),
	},
	render: function LoginFormFunction(args) {
		const [{ inputs }, setArgs] = useArgs();

		const rules = useMemo(
			() => ({
				id: inputs.id.length > 0,
				password: inputs.password.length > 5,
				all: inputs.id.length > 0 && inputs.password.length > 5,
			}),
			[inputs]
		);

		const inputOnChange = useCallback(
			(key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
				setArgs({
					inputs: { ...inputs, [key]: e.currentTarget.value },
				});
			},
			[inputs, setArgs]
		);

		const submitOnClick = useCallback(
			(e: React.FormEvent<HTMLFormElement>) => {
				e.preventDefault();
				if (rules.all) alert(1);
			},
			[rules]
		);

		return (
			<LoginForm
				rules={rules}
				inputs={inputs}
				errorMessage={errors(args.errorMessage as string)}
				inputOnChange={inputOnChange}
				submitOnClick={submitOnClick}
				registerButtonOnClick={args.registerButtonOnClick}
			/>
		);
	},
};
