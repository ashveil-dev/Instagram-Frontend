import { useCallback, useEffect, useState } from "react";
import EnterContentComponent from "@/components/modal/createPost/EnterContent";
import getPreviewFromFile from "@/utils/hooks/getPreviewFromFile";

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
	const [images, setImages] = useState<string[]>([]);

	useEffect(() => {
		const arr: string[] = [];

		if (imageFileList !== undefined) {
			for (const imageFile of imageFileList) {
				getPreviewFromFile(imageFile)?.then((result: string) => {
					arr.push(result);
					setImages(arr);
				});
			}
		}
	}, [imageFileList]);

	const contentOnChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setContent(e.target.value);
		},
		[setContent]
	);

	return (
		<EnterContentComponent
			images={images}
			content={content}
			contentOnChange={contentOnChange}
		/>
	);
}

export default EnterContentContainer;
