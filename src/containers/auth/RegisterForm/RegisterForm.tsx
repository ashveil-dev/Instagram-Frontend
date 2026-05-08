import { useCallback, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/hooks/redux";
import RegisterFormComponent from "@/components/auth/RegisterForm/RegisterForm";
import errors from "@/utils/data/errors";
import { registerThunk } from "@/slices/user/thunk";
interface IRegisterContainer {
	loginButtonOnClick: () => void;
}

function RegisterFormContainer({ loginButtonOnClick }: IRegisterContainer) {
	const dispatch = useAppDispatch();
	const error = useAppSelector((state) => state.user.error);
	const [inputs, setInputs] = useState({
		phoneOrEmail: "",
		nickName: "",
		fullName: "",
		password: "",
	});

	const checkNickNameIsPossible = useCallback((nickName: string) => {
		return nickName.length > 5;
	}, []);

	const rules = useMemo(() => {
		const phoneRegExp = /01[0-9]{9}/;
		const emailRegExp = /[^@]+@.+/;
		const { phoneOrEmail, fullName, nickName, password } = inputs;

		const validPhoneOrEmail =
			phoneRegExp.test(phoneOrEmail) || emailRegExp.test(phoneOrEmail);
		const validFullName = fullName.length > 0;
		const validNickName = checkNickNameIsPossible(nickName);
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
			setInputs({ ...inputs, [key]: e.currentTarget.value });
		},
		[inputs]
	);

	const onSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (rules.all) {
				dispatch(registerThunk(inputs));
			}
		},
		[rules, inputs, dispatch]
	);

	return (
		<RegisterFormComponent
			rules={rules}
			inputs={inputs}
			onSubmit={onSubmit}
			errorMessage={errors(error.register)}
			inputOnChange={inputOnChange}
			loginButtonOnClick={loginButtonOnClick}
		/>
	);
}

export default RegisterFormContainer;
