import fs from "fs";
import path from "path";
import {
	DEFAULT_PROFILE_SOURCE,
	SEED_PROFILE_SOURCES,
	UNSPLASH_PUBLIC_DIR,
} from "./data/profileImages";
import {
	FALLBACK_REEL_DOWNLOADS,
	PUBLIC_REELS_DIR,
	SEED_REEL_QUERIES,
} from "./data/reelVideos";
import { downloadFile } from "./downloadFile";
import {
	copyPublicReelVideos,
	fetchPixabayReelVideos,
} from "./fetchPixabayReels";

function getPublicDir() {
	if (process.env.PUBLIC_DIR?.trim()) {
		return process.env.PUBLIC_DIR.trim();
	}
	const sibling = path.join(process.cwd(), "..", UNSPLASH_PUBLIC_DIR);
	if (fs.existsSync(sibling)) {
		return sibling;
	}
	return path.join(process.cwd(), "public");
}

function getPublicReelsDir() {
	const base = process.env.PUBLIC_DIR?.trim()
		? process.env.PUBLIC_DIR.trim()
		: fs.existsSync(path.join(process.cwd(), "..", "public"))
			? path.join(process.cwd(), "..", "public")
			: path.join(process.cwd(), "public");
	return path.join(base, PUBLIC_REELS_DIR);
}

function copyFromPublic(sourceFile: string, destFile: string) {
	const source = path.join(getPublicDir(), sourceFile);
	const dest = path.join(process.cwd(), "files", "images", destFile);

	if (!fs.existsSync(source)) {
		console.warn(`[seed] Missing public image: ${source}`);
		return;
	}

	fs.copyFileSync(source, dest);
}

export function ensureDirectories() {
	fs.mkdirSync(path.join(process.cwd(), "files", "images"), {
		recursive: true,
	});
	fs.mkdirSync(path.join(process.cwd(), "files", "videos"), {
		recursive: true,
	});
	fs.mkdirSync(getPublicReelsDir(), { recursive: true });
}

export function ensureUnsplashProfileImages() {
	for (const { source, dest } of Object.values(SEED_PROFILE_SOURCES)) {
		copyFromPublic(source, dest);
	}
	copyFromPublic(DEFAULT_PROFILE_SOURCE, "defaultProfileImage.jpg");
}

export function ensureDefaultProfileImage() {
	ensureUnsplashProfileImages();
}

function countReelFiles(videosDir: string): number {
	return SEED_REEL_QUERIES.filter(({ file }) =>
		fs.existsSync(path.join(videosDir, file))
	).length;
}

async function downloadFallbackReels(videosDir: string): Promise<number> {
	let count = 0;
	for (const { file, url } of FALLBACK_REEL_DOWNLOADS) {
		const dest = path.join(videosDir, file);
		if (fs.existsSync(dest) && fs.statSync(dest).size > 500_000) {
			count += 1;
			continue;
		}
		try {
			await downloadFile(url, dest);
			if (fs.statSync(dest).size > 500_000) {
				console.log(`[seed] Downloaded fallback ${file}`);
				count += 1;
			}
		} catch (e) {
			console.warn(`[seed] Fallback download failed (${file}):`, e);
		}
	}
	return count;
}

export async function ensureReelVideos(): Promise<void> {
	const videosDir = path.join(process.cwd(), "files", "videos");
	const publicReelsDir = getPublicReelsDir();
	const apiKey = process.env.PIXABAY_API_KEY?.trim();

	if (apiKey) {
		console.log("[seed] Fetching reel videos from Pixabay API...");
		try {
			const fetched = await fetchPixabayReelVideos(apiKey, videosDir);
			if (fetched >= SEED_REEL_QUERIES.length) {
				return;
			}
			console.warn(
				`[seed] Pixabay returned ${fetched}/${SEED_REEL_QUERIES.length} videos.`
			);
		} catch (e) {
			console.warn("[seed] Pixabay API failed:", e);
		}
	}

	const copied = copyPublicReelVideos(publicReelsDir, videosDir);
	if (countReelFiles(videosDir) >= SEED_REEL_QUERIES.length) {
		console.log(`[seed] Using ${copied || countReelFiles(videosDir)} reel video(s) from public/.`);
		return;
	}

	console.log("[seed] Downloading fallback reel videos...");
	const downloaded = await downloadFallbackReels(videosDir);
	const total = countReelFiles(videosDir);

	if (total < SEED_REEL_QUERIES.length) {
		console.warn(
			`[seed] Only ${total}/${SEED_REEL_QUERIES.length} reel videos ready. ` +
				"Set PIXABAY_API_KEY in server/.env for better Instagram-style reels."
		);
	} else {
		console.log(`[seed] Ready ${total} reel videos (fallback CDN).`);
	}

	if (!apiKey) {
		console.log(
			"[seed] Tip: Add PIXABAY_API_KEY (free at https://pixabay.com/api/docs/) for vertical lifestyle reels."
		);
	}
}
