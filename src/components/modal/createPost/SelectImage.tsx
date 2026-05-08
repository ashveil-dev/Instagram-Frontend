import MediaIcon from "@/assets/images/icons/media.svg?react";
interface ISelectImageComponent {
	fileRef: React.Ref<HTMLInputElement>;
	onClick: () => void;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function SelectImageComponent({
	fileRef,
	onClick,
	onChange,
}: ISelectImageComponent) {
	return (
		<div className="w-full h-full justify-center p-[24px] flex flex-col items-center">
			<span>
				<MediaIcon />
			</span>
			<p className="mt-[16px] leading-[25px] text-[20px] whitespace-pre-line break-words">
				사진과 동영상을 여기에 끌어다 놓으세요
			</p>
			<div className="p-[4px]">
				<input
					type="file"
					accept=".mp4, .avi, .png, .jpg, .jpeg"
					multiple
					ref={fileRef}
					className="hidden"
					onChange={onChange}
				/>
				<button
					onClick={onClick}
					className="mt-[24px] box-content h-[18px] bg-[rgb(0,149,246)] font-semibold leading-[14px] border-none outline-none rounded-[8px] text-[14px] text-white p-[7px_16px]"
				>
					컴퓨터에서 선택
				</button>
			</div>
		</div>
	);
}

export default SelectImageComponent;
