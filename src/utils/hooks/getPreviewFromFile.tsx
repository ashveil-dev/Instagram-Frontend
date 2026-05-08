export default function getPreviewFromFile(file: File) {
	if (!/\.(jpe?g|png|gif)$/i.test(file.name)) return;

	const reader = new FileReader();

	return new Promise<string>((resolve, reject) => {
		reader.addEventListener(
			"load",
			(readerEvent: ProgressEvent<FileReader>) => {
				if (
					readerEvent.target !== null &&
					typeof readerEvent.target.result === "string"
				)
					resolve(readerEvent.target.result);
				else reject();
			},
			false
		);

		reader.readAsDataURL(file);
	});
}
