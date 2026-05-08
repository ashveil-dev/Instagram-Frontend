import { useCallback, useRef, useState } from "react";
import LeftChevrono from "@/assets/images/icons/left_chevron.svg?react";
import RightChevron from "@/assets/images/icons/right_chevron.svg?react";

interface IImageSlideComponent {
	width: string;
	height: string;
	images: string[];
}

function ImageSlideComponent({ width, height, images }: IImageSlideComponent) {
	const lastSlide = images.length;
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

	return (
		<div
			style={{ width, height }}
			className="overflow-x-hidden overflow-y-hidden relative"
		>
			{currentSlide !== 0 && (
				<button
					className="absolute left-0 top-0 z-10 h-full "
					onClick={SlidePrevOnClick}
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
				{images.map((image: string) => (
					<div className="w-full h-full flex-shrink-0 overflow-hidden">
						<img
							src={image}
							key={image}
							className="object-cover w-full h-full"
						/>
					</div>
				))}
			</div>
			{currentSlide !== lastSlide - 1 && (
				<button
					className="absolute right-0 top-0 z-10 h-full"
					onClick={SlideNextOnClick}
				>
					<div className="m-[8px] p-[8px] bg-[rgba(26,26,26,.8)] rounded-[50%] shadow-[0 4px 12px rgba(0, 0, 0, .15)] flex items-center justify-center">
						<div className="w-[16px] h-[16px] flex items-center justify-center">
							<RightChevron className="w-full h-full text-white" />
						</div>
					</div>
				</button>
			)}
			<div className="absolute left-0 right-0 bottom-[15px] flex justify-center">
				{images.map((image, index) => (
					<div
						key={image}
						className={
							"bg-[#fff] mr-[4px] rounded-[50%] h-[6px] w-[6px] transition-opacity " +
							(currentSlide == index
								? "opacity-100"
								: "opacity-40")
						}
					/>
				))}
			</div>
			<div></div>
		</div>
	);
}

export default ImageSlideComponent;
