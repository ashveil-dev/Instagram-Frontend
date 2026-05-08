import { useCallback, useMemo } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import RegisterForm from "./RegisterForm";
import errors from "@/utils/data/errors";
import { fn } from "@storybook/test";
import { useArgs } from "@storybook/preview-api";

const meta = {
	title: "auth/RegisterForm",
	component: RegisterForm,
	tags: ["autodocs"],
	parameters: {},
	args: {},
} satisfies Meta<typeof RegisterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		rules: {},
		inputs: {
			phoneOrEmail: "",
			fullName: "",
			nickName: "",
			password: "",
		},
		errorMessage: "Input is invalid",
		onSubmit: fn(),
		inputOnChange: fn(),
		loginButtonOnClick: fn(),
	},
	render: function Render(args) {
		const [{ inputs }, updateArgs] = useArgs();

		const checkNickNameIsPossible = useCallback(() => {
			return inputs.nickName.length > 5;
		}, [inputs]);

		const rules = useMemo(() => {
			const phoneRegExp = /01[0-9]{9}/;
			const emailRegExp = /[^@]+@.+/;
			const { phoneOrEmail, fullName, password } = inputs;

			const validPhoneOrEmail =
				phoneRegExp.test(phoneOrEmail) ||
				emailRegExp.test(phoneOrEmail);
			const validFullName = fullName.length > 0;
			const validNickName = checkNickNameIsPossible();
			const validPassword = password.length > 5;

			return {
				phoneOrEmail: validPhoneOrEmail,
				fullName: validFullName,
				nickName: validNickName,
				password: validPassword,
				all:
					validPhoneOrEmail &&
					validFullName &&
					validNickName &&
					validPassword,
			};
		}, [inputs, checkNickNameIsPossible]);

		const inputOnChange = useCallback(
			(key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
				updateArgs({
					inputs: { ...inputs, [key]: e.currentTarget.value },
				});
			},
			[inputs, updateArgs]
		);

		const onSubmit = useCallback(
			(e: React.FormEvent<HTMLFormElement>) => {
				e.preventDefault();
				if (rules.all) alert("회원가입 요청");
			},
			[rules]
		);

		return (
			<RegisterForm
				rules={rules}
				inputs={inputs}
				onSubmit={onSubmit}
				errorMessage={errors(args.errorMessage as string)}
				inputOnChange={inputOnChange}
				loginButtonOnClick={args.loginButtonOnClick}
			/>
		);
	},
};
