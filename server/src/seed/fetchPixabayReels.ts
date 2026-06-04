import https from "https";
import fs from "fs";
import path from "path";
import { SEED_REEL_QUERIES } from "./data/reelVideos";
import { downloadFile } from "./downloadFile";

type PixabayVideoFile = {
	url: string;
	width: number;
	height: number;
};

type PixabayHit = {
	videos: Record<string, PixabayVideoFile | undefined>;
};

function fetchJson<T>(url: string): Promise<T> {
	return new Promise((resolve, reject) => {
		https
			.get(url, { headers: { "User-Agent": "Instagram-Seed/1.0" } }, (res) => {
				if (
					res.statusCode &&
					res.statusCode >= 300 &&
					res.statusCode < 400 &&
					res.headers.location
				) {
					fetchJson<T>(res.headers.location).then(resolve).catch(reject);
					return;
				}

				if (res.statusCode !== 200) {
					reject(new Error(`Pixabay API ${res.statusCode}`));
					return;
				}

				let data = "";
				res.on("data", (chunk) => {
					data += chunk;
				});
				res.on("end", () => {
					try {
						resolve(JSON.parse(data) as T);
					} catch (e) {
						reject(e);
					}
				});
			})
			.on("error", reject);
	});
}

function pickReelVideoUrl(videos: PixabayHit["videos"]): string | null {
	const order = ["large", "medium", "small", "tiny"] as const;
	const candidates = order
		.map((key) => videos[key])
		.filter((v): v is PixabayVideoFile => Boolean(v?.url));

	if (candidates.length === 0) {
		return null;
	}

	const portrait = candidates.find((v) => v.height >= v.width);
	return (portrait ?? candidates[0]).url;
}

export async function fetchPixabayReelVideos(
	apiKey: string,
	videosDir: string
): Promise<number> {
	let count = 0;

	for (const { query, file } of SEED_REEL_QUERIES) {
		const url =
			`https://pixabay.com/api/videos/?key=${encodeURIComponent(apiKey)}` +
			`&q=${encodeURIComponent(query)}` +
			`&per_page=10&video_type=film&safesearch=true`;

		const data = await fetchJson<{ hits?: PixabayHit[] }>(url);
		const hits = data.hits ?? [];

		let videoUrl: string | null = null;
		for (const hit of hits) {
			videoUrl = pickReelVideoUrl(hit.videos);
			if (videoUrl) break;
		}

		if (!videoUrl) {
			console.warn(`[seed] No Pixabay video for query: ${query}`);
			continue;
		}

		const dest = path.join(videosDir, file);
		await downloadFile(videoUrl, dest);
		console.log(`[seed] Downloaded ${file} (${query})`);
		count += 1;
	}

	return count;
}

export function copyPublicReelVideos(
	publicReelsDir: string,
	videosDir: string
): number {
	if (!fs.existsSync(publicReelsDir)) {
		return 0;
	}

	let count = 0;
	for (const { file } of SEED_REEL_QUERIES) {
		const source = path.join(publicReelsDir, file);
		const dest = path.join(videosDir, file);
		if (!fs.existsSync(source)) continue;
		fs.copyFileSync(source, dest);
		count += 1;
	}
	return count;
}
