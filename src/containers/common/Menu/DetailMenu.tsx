import { useAppSelector } from "@/utils/hooks/redux";
import DetailMenuComponent from "@/components/common/menu/DetailMenu/DetailMenu";

function DetailMenuContainer() {
	const show = useAppSelector((state) => state.view.detailMenu);
	return <DetailMenuComponent show={show} />;
}

export default DetailMenuContainer;
