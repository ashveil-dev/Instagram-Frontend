export function isMockApiEnabled(): boolean {
	return import.meta.env.VITE_USE_MOCK_API === "true";
}

/** 로컬: Vite 프록시 `/api` · GitHub Pages: mock · 배포: `VITE_SERVER_URL/api` */
export function getApiBaseURL(): string {
	if (isMockApiEnabled()) {
		return "/api";
	}
	const server = import.meta.env.VITE_SERVER_URL?.trim().replace(/\/$/, "");
	if (server) {
		return `${server}/api`;
	}
	const base = import.meta.env.BASE_URL.replace(/\/$/, "");
	return base ? `${base}/api` : "/api";
}
