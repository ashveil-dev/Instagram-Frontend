import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Menu from "@/containers/common/Menu/Menu";
import { useAppDispatch } from "@/utils/hooks/redux";
import { fetchMeThunk } from "@/slices/profile/slice";

function AppLayout() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchMeThunk(null));
	}, [dispatch]);

	return (
		<div className="flex w-full h-dvh overflow-hidden">
			<Menu />
			<main className="flex flex-1 min-w-0 justify-center overflow-y-auto overflow-x-hidden">
				<Outlet />
			</main>
		</div>
	);
}

export default AppLayout;
