import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SettingsPage() {
	const navigate = useNavigate();
	const [darkMode, setDarkMode] = useState(
		localStorage.getItem("theme") === "dark"
	);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", darkMode);
		localStorage.setItem("theme", darkMode ? "dark" : "light");
	}, [darkMode]);

	const toggleTheme = useCallback(() => {
		setDarkMode((prev) => !prev);
	}, []);

	return (
		<div className="w-full max-w-[600px] py-[24px] px-[20px]">
			<button
				type="button"
				onClick={() => navigate(-1)}
				className="text-[14px] font-semibold text-[#0095f6] mb-[24px]"
			>
				← 뒤로
			</button>
			<h1 className="text-[24px] font-bold mb-[24px]">설정</h1>
			<div className="border border-[#dbdbdb] rounded-[8px] p-[16px] flex justify-between items-center">
				<span className="text-[16px]">다크 모드</span>
				<button
					type="button"
					onClick={toggleTheme}
					className={
						"px-[16px] py-[8px] rounded-[8px] font-semibold text-[14px] " +
						(darkMode
							? "bg-[#0095f6] text-white"
							: "bg-[#efefef] text-black")
					}
				>
					{darkMode ? "켜짐" : "꺼짐"}
				</button>
			</div>
		</div>
	);
}

export default SettingsPage;
