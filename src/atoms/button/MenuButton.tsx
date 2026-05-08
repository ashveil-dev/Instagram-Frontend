import { useMemo } from "react";

interface IMenuButton {
	index: string;
	icon: string;
	iconOnClicked: string;
	label: string;
	currentIndexInButtonClicked: void | string;
	showLabel: boolean;
	buttonOnClick: (key: string) => () => void;
}

function MenuButton({
	index,
	icon,
	iconOnClicked,
	label,
	currentIndexInButtonClicked,
	showLabel,
	buttonOnClick,
}: IMenuButton) {
	const isButtonClicked = useMemo(
		() => currentIndexInButtonClicked === index,
		[index, currentIndexInButtonClicked]
	);

	return (
		<div
			className="flex gap-[16px] p-[12px] my-[4px] cursor-pointer text-[16px]"
			onClick={buttonOnClick(index)}
		>
			{isButtonClicked ? <img src={iconOnClicked} /> : <img src={icon} />}
			{showLabel && (
				<span className={isButtonClicked ? "font-bold" : "font-normal"}>
					{label}
				</span>
			)}
		</div>
	);
}

export default MenuButton;
