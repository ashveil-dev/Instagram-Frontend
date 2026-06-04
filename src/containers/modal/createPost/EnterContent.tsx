import { useCallback, useEffect, useRef, useState } from "react";
import EnterContentComponent from "@/components/modal/createPost/EnterContent";
import getMediaPreviewFromFile, {
	type MediaPreview,
} from "@/utils/hooks/getMediaPreviewFromFile";

interface IEnterContentContainer {
	imageFileList: FileList | undefined;
	content: string;
	setContent: (content: string) => void;
}

function EnterContentContainer({
	imageFileList,
	content,
	setContent,
}: IEnterContentContainer) {
	const [media, setMedia] = useState<MediaPreview[]>([]);
	const revokeUrlsRef = useRef<string[]>([]);

	useEffect(() => {
		revokeUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
		revokeUrlsRef.current = [];

		if (imageFileList === undefined) {
			setMedia([]);
			return;
		}

		let cancelled = false;

		const loadPreviews = async () => {
			const previews = await Promise.all(
				Array.from(imageFileList).map(async (file) => {
					const preview = getMediaPreviewFromFile(file);
					if (preview === null) {
						throw new Error(`Unsupported file: ${file.name}`);
					}
					return preview;
				})
			);

			if (cancelled) {
				previews
					.filter((item) => item.type === "video")
					.forEach((item) => URL.revokeObjectURL(item.url));
				return;
			}

			revokeUrlsRef.current = previews
				.filter((item) => item.type === "video")
				.map((item) => item.url);
			setMedia(previews);
		};

		loadPreviews().catch(() => {
			if (!cancelled) {
				setMedia([]);
			}
		});

		return () => {
			cancelled = true;
			revokeUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
			revokeUrlsRef.current = [];
		};
	}, [imageFileList]);

	const contentOnChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setContent(e.target.value);
		},
		[setContent]
	);

	return (
		<EnterContentComponent
			media={media}
			content={content}
			contentOnChange={contentOnChange}
		/>
	);
}

export default EnterContentContainer;
