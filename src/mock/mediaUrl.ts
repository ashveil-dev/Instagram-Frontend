/** GitHub Pages 등 정적 배포용 public 자산 URL */
export function mockPublicUrl(relativePath: string): string {
	const base = import.meta.env.BASE_URL.replace(/\/$/, "");
	const path = relativePath.startsWith("/")
		? relativePath
		: `/${relativePath}`;
	return `${base}${path}`;
}
