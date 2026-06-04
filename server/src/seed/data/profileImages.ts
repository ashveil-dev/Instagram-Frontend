/** public/ 폴더 Unsplash 원본 → server/files/images/ 복사본 */
export const UNSPLASH_PUBLIC_DIR = "public";

export const DEFAULT_PROFILE_SOURCE = "aiony-haust-3TLl_97HNJo-unsplash.jpg";

export const SEED_PROFILE_SOURCES: Record<
	string,
	{ source: string; dest: string }
> = {
	seed_travel: {
		source: "ian-dooley-d1UPkiFd04A-unsplash.jpg",
		dest: "profile-seed-travel.jpg",
	},
	seed_photo: {
		source: "michael-dam-mEZ3PoFGs_k-unsplash.jpg",
		dest: "profile-seed-photo.jpg",
	},
	seed_daily: {
		source: "aiony-haust-3TLl_97HNJo-unsplash.jpg",
		dest: "profile-seed-daily.jpg",
	},
	seed_reels: {
		source: "pablo-soriano-Hnp-cs9QVOc-unsplash.jpg",
		dest: "profile-seed-reels.jpg",
	},
};

export function getSeedProfileImagePath(nickName: string) {
	const entry = SEED_PROFILE_SOURCES[nickName];
	if (!entry) {
		return `images/${DEFAULT_PROFILE_SOURCE}`;
	}
	return `images/${entry.dest}`;
}
