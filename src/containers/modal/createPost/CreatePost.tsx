import { useMemo, useState, useCallback } from "react";
import Layout from "@/components/modal/createPost/Layout";
import SelectImage from "@/containers/modal/createPost/SelectImage";
import EnterContent from "@/containers/modal/createPost/EnterContent";
import Upload from "@/containers/modal/createPost/Upload";

function CreatePost() {
	const [content, setContent] = useState("");
	const [imageFileList, setImageFileList] = useState<FileList>();
	const [modalIndex, setModalIndex] = useState(0);

	const selectImageNextOnClick = useCallback(() => {
		setModalIndex(1);
	}, []);

	const EnterContentPrevOnClick = useCallback(() => {
		setModalIndex(0);
	}, []);

	const EnterContentNextOnClick = useCallback(async () => {
		setModalIndex(2);
	}, []);

	const layouts = useMemo(
		() => [
			<Layout
				width="700px"
				height="743px"
				first
				title="이미지 선택하기"
				body={
					<SelectImage
						setImageFileList={setImageFileList}
						moveNext={selectImageNextOnClick}
					/>
				}
			/>,
			<Layout
				width={"1040px"}
				height={"743px"}
				next="완료하기"
				title="문구 입력하기"
				body={
					<EnterContent
						imageFileList={imageFileList}
						content={content}
						setContent={setContent}
					/>
				}
				prevOnClick={EnterContentPrevOnClick}
				nextOnClick={EnterContentNextOnClick}
			/>,
			<Layout
				width={"1040px"}
				height={"743px"}
				first
				title="게시물 공유하기"
				body={
					<Upload content={content} imageFileList={imageFileList} />
				}
			/>,
		],
		[
			setImageFileList,
			imageFileList,
			content,
			setContent,
			selectImageNextOnClick,
			EnterContentPrevOnClick,
			EnterContentNextOnClick,
		]
	);

	return layouts[modalIndex];
}

export default CreatePost;
