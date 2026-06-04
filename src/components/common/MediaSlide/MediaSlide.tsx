import { useCallback, useRef, useState } from "react";
import LeftChevrono from "@/assets/images/icons/left_chevron.svg?react";
import RightChevron from "@/assets/images/icons/right_chevron.svg?react";
import type { MediaPreview } from "@/utils/hooks/getMediaPreviewFromFile";
import {
	isImageMediaUrl,
	isVideoMediaUrl,
	resolveMediaUrl,
} from "@/utils/mediaUrl";

type SlideItem = MediaPreview | string;

interface IMediaSlideComponent {
	width: string;
	height: string;
	media: SlideItem[];
}

function isMediaPreview(item: SlideItem): item is MediaPreview {
	return typeof item === "object" && "type" in item && "url" in item;
}

function MediaSlideComponent({ width, height, media }: IMediaSlideComponent) {
	const lastSlide = media.length;
	const sliderRef = useRef<HTMLDivElement>(null);
	const [currentSlide, setCurrentSlide] = useState(0);

	const SlidePrevOnClick = useCallback(() => {
		if (currentSlide > 0 && sliderRef.current !== null) {
			const translateX =
				sliderRef.current.clientWidth * (currentSlide - 1);
			sliderRef.current.style.transform = `translateX(-${translateX}px)`;
			setCurrentSlide(currentSlide - 1);
		}
	}, [currentSlide]);

	const SlideNextOnClick = useCallback(() => {
		if (currentSlide < lastSlide - 1 && sliderRef.current !== null) {
			const translateX =
				sliderRef.current.clientWidth * (currentSlide + 1);
			sliderRef.current.style.transform = `translateX(-${translateX}px)`;
			setCurrentSlide(currentSlide + 1);
		}
	}, [currentSlide, lastSlide]);

	const renderSlide = (item: SlideItem, index: number) => {
		if (isMediaPreview(item)) {
			if (item.type === "video") {
				return (
					<video
						key={`${item.url}-${index}`}
						controls
						src={item.url}
						className="object-cover w-full h-full"
					/>
				);
			}
			return (
				<img
					key={`${item.url}-${index}`}
					src={item.url}
					alt=""
					className="object-cover w-full h-full"
				/>
			);
		}

		const src = resolveMediaUrl(item);
		if (isVideoMediaUrl(item)) {
			return (
				<video
					key={src}
					controls
					className="object-cover w-full h-full"
				>
					<source src={src} />
				</video>
			);
		}

		if (isImageMediaUrl(item)) {
			return (
				<img
					key={src}
					src={src}
					alt=""
					className="object-cover w-full h-full"
				/>
			);
		}

		return null;
	};

	if (media.length === 0) {
		return (
			<div
				style={{ width, height }}
				className="flex items-center justify-center bg-black text-white text-[14px]"
			>
				미리보기를 불러올 수 없습니다.
			</div>
		);
	}

	return (
		<div
			style={{ width, height }}
			className="overflow-x-hidden overflow-y-hidden relative bg-black"
		>
			{currentSlide !== 0 && (
				<button
					className="absolute left-0 top-0 z-10 h-full "
					onClick={SlidePrevOnClick}
					type="button"
				>
					<div className="m-[8px] p-[8px] bg-[rgba(26,26,26,.8)] rounded-[50%] shadow-[0 4px 12px rgba(0, 0, 0, .15)] flex items-center justify-center">
						<div className="w-[16px] h-[16px] flex items-center justify-center">
							<LeftChevrono className="w-full h-full text-white" />
						</div>
					</div>
				</button>
			)}
			<div
				className="flex w-full h-full items-start transition-transform duration-500 "
				ref={sliderRef}
			>
				{media.map((item, index) => (
					<div
						key={isMediaPreview(item) ? item.url : item}
						className="w-full h-full flex-shrink-0 overflow-hidden"
					>
						{renderSlide(item, index)}
					</div>
				))}
			</div>
			{currentSlide !== lastSlide - 1 && (
				<button
					className="absolute right-0 top-0 z-10 h-full"
					onClick={SlideNextOnClick}
					type="button"
				>
					<div className="m-[8px] p-[8px] bg-[rgba(26,26,26,.8)] rounded-[50%] shadow-[0 4px 12px rgba(0, 0, 0, .15)] flex items-center justify-center">
						<div className="w-[16px] h-[16px] flex items-center justify-center">
							<RightChevron className="w-full h-full text-white" />
						</div>
					</div>
				</button>
			)}
			{lastSlide > 1 && (
				<div className="absolute left-0 right-0 bottom-[15px] flex justify-center">
					{media.map((item, index) => (
						<div
							key={isMediaPreview(item) ? item.url : item}
							className={
								"bg-[#fff] mr-[4px] rounded-[50%] h-[6px] w-[6px] transition-opacity " +
								(currentSlide === index
									? "opacity-100"
									: "opacity-40")
							}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default MediaSlideComponent;
