import { useEffect, useState } from "react";
import SlideImage1 from "@/assets/images/imageSlider/screenshot1.png";
import SlideImage2 from "@/assets/images/imageSlider/screenshot2.png";
import SlideImage3 from "@/assets/images/imageSlider/screenshot3.png";
import SlideImage4 from "@/assets/images/imageSlider/screenshot4.png";

const images = [SlideImage1, SlideImage2, SlideImage3, SlideImage4];

function ImageSliderComponent() {
	const [fadeInIndex, setFadeInIndex] = useState(0);

	useEffect(() => {
		setInterval(() => {
			setFadeInIndex(
				(_fadeInIndex) => (_fadeInIndex + 1) % images.length
			);
		}, 3000);
	}, []);

	return (
		<div className="relative flex-shrink-0 bg-[url('/src/assets/images/imageSlider/home-phones.png')] w-[380.32px] h-[581.15px] bg-[length:468.32px_634.15px] bg-[-46px_0px]">
			<div className="absolute w-[250px] mt-7 ml-[112px] top-0">
				{images.map((image, index) => (
					<img
						key={index}
						src={image}
						className={`absolute transition-opacity ease-in-out duration-[2000ms] ${fadeInIndex === index ? "opacity-100" : "opacity-0"}`}
					/>
				))}
			</div>
		</div>
	);
}

export default ImageSliderComponent;
