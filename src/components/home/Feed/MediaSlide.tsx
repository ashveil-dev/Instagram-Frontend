import MediaSlide from "@/components/common/MediaSlide/MediaSlide";

interface IMediaSlideComponent {
	width: string;
	height: string;
	mediaArray: string[];
}

function MediaSlideComponent({ width, height, mediaArray }: IMediaSlideComponent) {
	return (
		<MediaSlide width={width} height={height} media={mediaArray} />
	);
}

export default MediaSlideComponent;
