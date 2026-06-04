import { buildMediaUrl } from "../../utils/buildMediaUrl";
import { getSeedProfileImagePath } from "./profileImages";

export const SEED_USER_PASSWORD = "password123";

export type SeedUser = {
	email: string;
	fullName: string;
	nickName: string;
	photoPath: string;
};

export const seedUsers: SeedUser[] = [
	{
		email: "seed_travel@example.com",
		fullName: "여행 기록",
		nickName: "seed_travel",
		photoPath: getSeedProfileImagePath("seed_travel"),
	},
	{
		email: "seed_photo@example.com",
		fullName: "사진 작가",
		nickName: "seed_photo",
		photoPath: getSeedProfileImagePath("seed_photo"),
	},
	{
		email: "seed_daily@example.com",
		fullName: "일상 스냅",
		nickName: "seed_daily",
		photoPath: getSeedProfileImagePath("seed_daily"),
	},
	{
		email: "seed_reels@example.com",
		fullName: "릴스 크리에이터",
		nickName: "seed_reels",
		photoPath: getSeedProfileImagePath("seed_reels"),
	},
];

export function getSeedUserPhoto(path: string) {
	return buildMediaUrl(path);
}
