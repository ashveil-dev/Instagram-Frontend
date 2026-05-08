import InstagramImage from "@/assets/images/instagram.png";
import MetaImage from "@/assets/images/meta.png";

function LoadingComponent() {
	return (
		<div className="flex flex-col w-full h-full">
			<div className="flex flex-grow items-center justify-center">
				<img src={InstagramImage} width={80} height={80} />
			</div>
			<div className="flex items-center justify-center pb-[50px]">
				<img src={MetaImage} width={72} height={32} />
			</div>
		</div>
	);
}

export default LoadingComponent;
