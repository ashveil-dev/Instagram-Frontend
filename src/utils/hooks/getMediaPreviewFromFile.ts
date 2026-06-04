export type MediaPreview = {
	type: "image" | "video";
	url: string;
};

function isImageFile(file: File) {
	return (
		file.type.startsWith("image/") ||
		/\.(jpe?g|png|gif|webp)$/i.test(file.name)
	);
}

function isVideoFile(file: File) {
	return (
		file.type.startsWith("video/") ||
		/\.(mp4|avi)$/i.test(file.name)
	);
}

export default function getMediaPreviewFromFile(
	file: File
): Promise<MediaPreview> | null {
	if (isImageFile(file)) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.addEventListener(
				"load",
				(readerEvent: ProgressEvent<FileReader>) => {
					if (
						readerEvent.target !== null &&
						typeof readerEvent.target.result === "string"
					) {
						resolve({ type: "image", url: readerEvent.target.result });
					} else {
						reject();
					}
				},
				false
			);
			reader.readAsDataURL(file);
		});
	}

	if (isVideoFile(file)) {
		return Promise.resolve({
			type: "video",
			url: URL.createObjectURL(file),
		});
	}

	return null;
}
