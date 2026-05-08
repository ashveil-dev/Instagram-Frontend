import LoadingGif from "@/assets/images/gifs/loading.gif";
import SuccessGif from "@/assets/images/gifs/success.gif";

interface IUploadComponent {
	isLoading: boolean;
}

function UploadComponent({ isLoading }: IUploadComponent) {
	return (
		<div className="w-full h-full flex items-center justify-center">
			<div className="flex-col">
				{isLoading ? (
					<img src={LoadingGif} />
				) : (
					<>
						<div className="flex items-center justify-center mb-[15px]">
							<img src={SuccessGif} />
						</div>
						<div className="text-[20px] font-semibold">
							게시물이 공유되었습니다.
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default UploadComponent;
