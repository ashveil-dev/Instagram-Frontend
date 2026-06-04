import { buildMediaUrl } from "../../utils/buildMediaUrl";

export type SeedReelPost = {
	authorNickName: string;
	caption: string;
	videoFile: string;
	likeCount: number;
	daysAgo: number;
};

export const seedReelPosts: SeedReelPost[] = [
	{
		authorNickName: "seed_reels",
		caption: "스마트폰으로 찍은 오늘의 순간 📱",
		videoFile: "videos/reel-01-social.mp4",
		likeCount: 542,
		daysAgo: 1,
	},
	{
		authorNickName: "seed_reels",
		caption: "카페 브이로그 ☕️ #릴스 #일상",
		videoFile: "videos/reel-02-cafe.mp4",
		likeCount: 318,
		daysAgo: 2,
	},
	{
		authorNickName: "seed_travel",
		caption: "바다 노을 🌊 #여행 #릴스",
		videoFile: "videos/reel-03-beach.mp4",
		likeCount: 891,
		daysAgo: 3,
	},
	{
		authorNickName: "seed_photo",
		caption: "스트릿 패션 스냅 👟",
		videoFile: "videos/reel-04-fashion.mp4",
		likeCount: 427,
		daysAgo: 4,
	},
	{
		authorNickName: "seed_daily",
		caption: "도시의 밤 🌃",
		videoFile: "videos/reel-05-city.mp4",
		likeCount: 673,
		daysAgo: 5,
	},
];

export function getReelContents(videoFile: string) {
	return [buildMediaUrl(videoFile)];
}
