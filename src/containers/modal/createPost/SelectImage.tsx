import { useRef, useCallback } from "react";
import SelectImageComponent from "@/components/modal/createPost/SelectImage";

interface ISelectImageContainer {
	setImageFileList: (s: FileList) => void;
	moveNext: () => void;
}

function SelectImageContainer({
	setImageFileList,
	moveNext,
}: ISelectImageContainer) {
	const fileRef = useRef<HTMLInputElement>(null);

	const onClick = useCallback(() => {
		if (fileRef.current !== null) fileRef.current.click();
	}, []);

	const onChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			console.log(e.target.files);
			if (e.target.files !== null) {
				setImageFileList(e.target.files);
				moveNext();
			}
		},
		[setImageFileList, moveNext]
	);

	return (
		<SelectImageComponent
			fileRef={fileRef}
			onClick={onClick}
			onChange={onChange}
		/>
	);
}

export default SelectImageContainer;
