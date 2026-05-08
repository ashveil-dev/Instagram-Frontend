import { ChangeEvent, useCallback, useState } from "react";

interface IInput {
	label: string;
	value: string;
	isValidValue?: boolean;
	useToggleHiding?: boolean;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function Input({
	label,
	value,
	isValidValue,
	useToggleHiding,
	onChange,
}: IInput) {
	const [toggleHiding, setToggleHiding] = useState(true);

	const onChangeToggleHiding = useCallback(() => {
		setToggleHiding((toggle) => !toggle);
	}, []);

	return (
		<div className="relative flex-auto flex flex-row h-9 border gap-2 border-[#dbdbdb] ml-[40px] mr-[40px] mb-[6px]">
			<input
				type={useToggleHiding && toggleHiding ? "password" : "text"}
				onChange={onChange}
				className="top-0 left-0  flex-[1_0_0px] pt-[14px] pb-[2px] pl-[8px] border-0 outline-none overflow-hidden ellipsis text-[12px]"
			/>
			<div
				className={
					"absolute top-0 left-[8px] h-9 leading-9 text-[#737373] text-[12px] overflow-hidden pointer-events-none origin-left transition-transform ease-out duration-100 " +
					(value === "" ? "" : "translate-y-[-10px] scale-[0.80]")
				}
			>
				<span>{label}</span>
			</div>
			<div className="flex justify-center items-center h-full mr-1">
				<div
					className={
						"w-[22px] h-[22px] bg-[url('/src/assets/images/TJztmXpWTmS.png')] " +
						(isValidValue !== undefined &&
							value !== "" &&
							(isValidValue
								? "bg-[-225px_-333px]"
								: "bg-[-249px_-333px]"))
					}
				></div>
			</div>
			<div
				className="h-full justify-center text-[14px] text-[#262626] cursor-pointer font-bold flex items-center mr-1"
				onClick={onChangeToggleHiding}
			>
				<span>
					{useToggleHiding &&
						value !== "" &&
						(toggleHiding ? "표시" : "숨기기")}
				</span>
			</div>
		</div>
	);
}

export default Input;
