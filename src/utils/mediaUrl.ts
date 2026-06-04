export function resolveMediaUrl(url: string): string {
	const trimmed = url.trim();
	if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
		return trimmed;
	}
	// Vite public/ 정적 파일 (API /images, /videos 가 아님)
	if (
		trimmed.startsWith("/") &&
		!trimmed.startsWith("/images/") &&
		!trimmed.startsWith("/videos/")
	) {
		return trimmed;
	}
	const base = (import.meta.env.VITE_SERVER_URL ?? "").replace(/\/$/, "");
	const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return `${base}${path}`;
}

export function isImageMediaUrl(url: string): boolean {
	return /\/images\//i.test(url) || /\.(jpe?g|png|gif|webp)$/i.test(url);
}

export function isVideoMediaUrl(url: string): boolean {
	return /\/videos\//i.test(url) || /\.(mp4|avi)$/i.test(url);
}
