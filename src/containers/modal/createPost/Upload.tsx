import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/hooks/redux";
import Upload from "@/components/modal/createPost/Upload";
import { uploadFeedThunk } from "@/slices/feed/thunk";

interface IUploadContainer {
	content: string;
	imageFileList?: FileList;
}

function UploadContainer({ content, imageFileList }: IUploadContainer) {
	const dispatch = useAppDispatch();
	const loading = useAppSelector((state) => state.feed.loading);

	useEffect(() => {
		dispatch(uploadFeedThunk({ caption: content, files: imageFileList }));
	}, [dispatch, content, imageFileList]);

	return <Upload isLoading={loading} />;
}

export default UploadContainer;
