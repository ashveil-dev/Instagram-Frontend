import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchComponent from "@/components/common/menu/SlideMenu/slide/Search/Search";
import { searchUsersApi } from "@/slices/user/profileApi";
import type { IUserSummary } from "@/utils/types/user";
import { createConversationApi } from "@/slices/user/profileApi";

const RECENT_KEY = "instagram_recent_searches";

function loadRecent(): IUserSummary[] {
	try {
		const raw = localStorage.getItem(RECENT_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

function saveRecent(users: IUserSummary[]) {
	localStorage.setItem(RECENT_KEY, JSON.stringify(users.slice(0, 10)));
}

function SearchContainer() {
	const navigate = useNavigate();
	const [searchValue, setSearchValue] = useState("");
	const [results, setResults] = useState<IUserSummary[]>([]);
	const [recent, setRecent] = useState<IUserSummary[]>(loadRecent);

	useEffect(() => {
		if (searchValue.trim() === "") {
			setResults([]);
			return;
		}

		const timer = setTimeout(() => {
			searchUsersApi(searchValue.trim()).then((data) =>
				setResults(data.users)
			);
		}, 300);

		return () => clearTimeout(timer);
	}, [searchValue]);

	const addRecent = useCallback((user: IUserSummary) => {
		setRecent((prev) => {
			const next = [
				user,
				...prev.filter((item) => item.id !== user.id),
			].slice(0, 10);
			saveRecent(next);
			return next;
		});
	}, []);

	const profileOnClick = useCallback(
		(user: IUserSummary) => () => {
			addRecent(user);
			navigate(`/profile/${user.nickName}`);
		},
		[addRecent, navigate]
	);

	const clearRecent = useCallback(() => {
		setRecent([]);
		localStorage.removeItem(RECENT_KEY);
	}, []);

	const removeRecent = useCallback((id: string) => {
		setRecent((prev) => {
			const next = prev.filter((user) => user.id !== id);
			saveRecent(next);
			return next;
		});
	}, []);

	const messageOnClick = useCallback(
		(user: IUserSummary) => async () => {
			addRecent(user);
			await createConversationApi(user.id);
			navigate("/direct");
		},
		[addRecent, navigate]
	);

	return (
		<SearchComponent
			searchValue={searchValue}
			onSearchChange={setSearchValue}
			results={results}
			recent={recent}
			onClearRecent={clearRecent}
			onProfileClick={profileOnClick}
			onRemoveRecent={removeRecent}
			onMessageClick={messageOnClick}
		/>
	);
}

export default SearchContainer;
