import { useState, useCallback } from "react";
import ImageSlide from "@/components/common/ImageSlide/imageSlide2";
import ProfileImage from "@/assets/images/test/profile.jpg";
import IconIcon from "@/assets/images/icons/icon.svg?react";

interface IEnterContentComponent {
	images: string[];
	content: string;
	contentOnChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function EnterContentComponent({
	images,
	content,
	contentOnChange,
}: IEnterContentComponent) {
	const [textLengthClicked, setTextLengthClicked] = useState(false);

	const textLengthOnClick = useCallback(() => {
		setTextLengthClicked((_textLengthClicked) => !_textLengthClicked);
	}, []);

	return (
		<div className="flex w-full h-full ">
			<div className="basis-[66.6666%] overflow-hidden">
				<ImageSlide width="100%" height="100%" images={images} />
			</div>
			<form className="basis-[33.3333%] overflow-y-hidden flex items-stretch">
				<div className="relative flex flex-col w-full overflow-y-hidden">
					<div className="mx-[16px] mt-[18px] mb-[14px]">
						<div className="flex items-center ">
							<div className="w-[28px] h-[28px] mr-[12px] overflow-x-hidden overflow-y-hidden rounded-[50%]">
								<img
									src={ProfileImage}
									className="w-full h-full"
								/>
							</div>
							<div className="leading-[18px] text-[14px] font-semibold break-words">
								psycoma99
							</div>
						</div>
					</div>
					<div
						tabIndex={0}
						className="relative px-[16px] flex-grow overflow-y-hidden select-text whitespace-pre-wrap break-words"
					>
						<textarea
							value={content}
							placeholder="문구를 입력하세요..."
							onChange={contentOnChange}
							className="w-full h-full overflow-y-hidden border-none outline-none"
						/>
					</div>
					<div className="flex items-center">
						<div className="flex-grow px-[8px] py-[4px]">
							<button
								type="button"
								className="flex justify-center items-center bg-transparent border-none outline-none cursor-pointer p-[8px]"
							>
								<IconIcon className="w-[20px] h-[20px] text-[rgb(115,115,115)]" />
							</button>
						</div>
						<div
							onClick={textLengthOnClick}
							className="px-[12px] flex-shrink relative cursor-pointer"
						>
							<div className="px-[4px]">
								<span
									className={
										"leading-[16px] whitespace-pre-line text-[12px] break-words " +
										(textLengthClicked
											? "text-black"
											: "text-[rgb(199,199,199)]")
									}
								>
									{content.length}/2200
								</span>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}

export default EnterContentComponent;
