import { buildMediaUrl } from "../../utils/buildMediaUrl";

export type SeedFeedPost = {
	authorNickName: string;
	caption: string;
	imageFiles: string[];
	likeCount: number;
	daysAgo: number;
};

export const seedFeedPosts: SeedFeedPost[] = [
	{
		authorNickName: "seed_travel",
		caption: "주말에 다녀온 카페 ☕️ 햇빛이 너무 좋았어요.",
		imageFiles: ["images/1781133802451.png"],
		likeCount: 128,
		daysAgo: 1,
	},
	{
		authorNickName: "seed_photo",
		caption: "오늘의 스냅 📷 색감 보정만 살짝 했습니다.",
		imageFiles: ["images/1781190833769.jpeg", "images/1780547901764.png"],
		likeCount: 256,
		daysAgo: 2,
	},
	{
		authorNickName: "seed_daily",
		caption: "집 앞 공원 산책 🌿",
		imageFiles: ["images/1780547901764.png"],
		likeCount: 89,
		daysAgo: 3,
	},
	{
		authorNickName: "seed_travel",
		caption: "비 오는 날의 도심 🌧️",
		imageFiles: ["images/1781133802451.png", "images/1781190833769.jpeg"],
		likeCount: 412,
		daysAgo: 4,
	},
	{
		authorNickName: "seed_photo",
		caption: "필름 감성으로 찍어봤어요.",
		imageFiles: ["images/1781190833769.jpeg"],
		likeCount: 67,
		daysAgo: 5,
	},
	{
		authorNickName: "seed_daily",
		caption: "오늘의 식단 🥗",
		imageFiles: ["images/1780547901764.png", "images/1781133802451.png"],
		likeCount: 193,
		daysAgo: 6,
	},
];

export function getFeedContents(imageFiles: string[]) {
	return imageFiles.map((file) => buildMediaUrl(file));
}
