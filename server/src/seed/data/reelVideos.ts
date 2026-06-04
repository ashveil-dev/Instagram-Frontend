/** 릴스 시드용 영상 (Pixabay API 검색어 + 저장 파일명) */
export const SEED_REEL_QUERIES: { query: string; file: string }[] = [
	{ query: "woman smartphone social media", file: "reel-01-social.mp4" },
	{ query: "coffee cafe latte", file: "reel-02-cafe.mp4" },
	{ query: "beach sunset summer", file: "reel-03-beach.mp4" },
	{ query: "fashion street style", file: "reel-04-fashion.mp4" },
	{ query: "city night neon lights", file: "reel-05-city.mp4" },
];

/** API 키 없을 때 사용하는 무료 CDN (Pixabay + 짧은 샘플) */
export const FALLBACK_REEL_DOWNLOADS: { file: string; url: string }[] = [
	{
		file: "reel-01-social.mp4",
		url: "https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4",
	},
	{
		file: "reel-02-cafe.mp4",
		url: "https://download.samplelib.com/mp4/sample-10s.mp4",
	},
	{
		file: "reel-03-beach.mp4",
		url: "https://download.samplelib.com/mp4/sample-15s.mp4",
	},
	{
		file: "reel-04-fashion.mp4",
		url: "https://download.samplelib.com/mp4/sample-20s.mp4",
	},
	{
		file: "reel-05-city.mp4",
		url: "https://download.samplelib.com/mp4/sample-30s.mp4",
	},
];

export const PUBLIC_REELS_DIR = "videos/reels";
