import { useCallback, useRef, useState } from "react";

interface IMediaSlideComponent {
	width: string;
	height: string;
	mediaArray: string[];
}

function MediaSlideComponent({ width, height, mediaArray }: IMediaSlideComponent) {
	const lastSlide = mediaArray.length;
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
			className="relative overflow-x-hidden overflow-y-hidden"
		>
			{currentSlide !== 0 && (
				<button
					className="absolute top-0 left-0 z-10 h-full "
					onClick={SlidePrevOnClick}
				>
					<div className="my-[16px] mx-[8px] bg-[url('/src/assets/images/TJztmXpWTmS.png')] bg-[-130px_-98px] w-[30px] h-[30px] " />
				</button>
			)}
			<div
				className="flex items-start w-full h-full transition-transform duration-500 "
				ref={sliderRef}
			>
				{mediaArray.map((media: string) => (
					<div
						key={media}
						className="flex-shrink-0 w-full h-full overflow-hidden"
					>
						{media.split("/")[1] === "images" &&
							<img
								src={import.meta.env.VITE_SERVER_URL + media}
								className="object-cover w-full h-full"
							/>}
						{media.split("/")[1] === "videos" &&
							<video
								controls
								className="object-cover w-full h-full"
							>
								<source src={import.meta.env.VITE_SERVER_URL + media} />
							</video>
						}
					</div>
				))}
			</div>
			{currentSlide !== lastSlide - 1 && (
				<button
					className="absolute top-0 right-0 z-10 h-full"
					onClick={SlideNextOnClick}
				>
					<div className="my-[16px] mx-[8px] bg-[url('/src/assets/images/TJztmXpWTmS.png')] bg-[-162px_-98px] w-[30px] h-[30px]" />
				</button>
			)}
			<div className="absolute left-0 right-0 bottom-[15px] flex justify-center">
				{mediaArray.map((_1, index: number) => (
					<div
						key={index}
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

export default MediaSlideComponent;
