import React from "react";
import ReturnIcon from "@/assets/images/icons/return.svg?react";

interface ILayoutComponent {
	width: string;
	height: string;
	title: string;
	first?: boolean;
	next?: string;
	body: string | React.ReactElement;
	prevOnClick?: () => void;
	nextOnClick?: () => void;
}

function LayoutComponent({
	width,
	height,
	title,
	first,
	next,
	body,
	prevOnClick,
	nextOnClick,
}: ILayoutComponent) {
	return (
		<div
			style={{ width, height }}
			className="flex flex-col flex-shrink-0  m-[20px] rounded-[12px] bg-white "
		>
			<div className="relative flex items-center space-between h-[43px] flex-shrink-0 border-b border-b-[rgb(219,219,219)] ">
				{!first && (
					<div
						className="ml-[8px] cursor-pointer absolute left-0"
						onClick={prevOnClick}
					>
						<div className="p-[8px]">
							<ReturnIcon />
						</div>
					</div>
				)}
				<span className="text-[16px] font-semibold leading-[16px] flex-grow text-center w-full]">
					{title}
				</span>
				<div
					className="p-[16px] absolute right-0"
					onClick={nextOnClick}
				>
					<span className="font-semibold text-[14px] text-[rgb(0,149,246)] leading-[18px] cursor-pointer">
						{next}
					</span>
				</div>
			</div>
			<div className="w-full items-center flex-grow overflow-y-hidden">
				{body}
			</div>
		</div>
	);
}

export default LayoutComponent;
