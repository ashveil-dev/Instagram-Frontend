import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/utils/hooks/redux";
import { setModal } from "@/slices/view/slice";
import Modal from "@/components/modal/Modal";
import CreatePost from "@/containers/modal/createPost/CreatePost";
import DetailFeedContainer from "@/containers/modal/DetailFeed";

function ModalContainer() {
	const dispatch = useAppDispatch();
	const modal = useAppSelector((state) => state.view.modal);

	const exitModal = useCallback(() => {
		dispatch(setModal(null));
	}, [dispatch]);

	if (modal !== null)
		return (
			<Modal exitModal={exitModal}>
				{modal === "createPost" && <CreatePost />}
				{modal === "showDetailFeed" && <DetailFeedContainer />}
			</Modal>
		);
	return null;
}

export default ModalContainer;
