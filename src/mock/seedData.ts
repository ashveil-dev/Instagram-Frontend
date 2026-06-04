import { DEFAULT_PROFILE_IMAGE, UNSPLASH_PROFILE_IMAGES } from "@/constants/profileImages";
import { mockPublicUrl } from "./mediaUrl";
import type { MockDatabase } from "./types";

const img = {
	travel: mockPublicUrl(UNSPLASH_PROFILE_IMAGES.travel),
	photo: mockPublicUrl(UNSPLASH_PROFILE_IMAGES.photo),
	daily: mockPublicUrl(UNSPLASH_PROFILE_IMAGES.daily),
	reels: mockPublicUrl(UNSPLASH_PROFILE_IMAGES.reels),
	default: mockPublicUrl(DEFAULT_PROFILE_IMAGE),
};

const reel = (name: string) => mockPublicUrl(`/videos/reels/${name}`);

function daysAgo(days: number) {
	const d = new Date();
	d.setDate(d.getDate() - days);
	return d.toISOString();
}

function uid(prefix: string) {
	return `seed-${prefix}`;
}

export const SEED_PASSWORD = "password123";

export function createInitialDatabase(): MockDatabase {
	const users = [
		{
			id: uid("travel"),
			email: "seed_travel@example.com",
			nickName: "seed_travel",
			fullName: "여행 기록",
			password: SEED_PASSWORD,
			photo: img.travel,
			follower: 120,
			following: 80,
			followers: [uid("photo")],
			followings: [uid("photo")],
			savedPosts: [],
		},
		{
			id: uid("photo"),
			email: "seed_photo@example.com",
			nickName: "seed_photo",
			fullName: "사진 작가",
			password: SEED_PASSWORD,
			photo: img.photo,
			follower: 340,
			following: 210,
			followers: [uid("travel")],
			followings: [uid("travel"), uid("daily")],
			savedPosts: [],
		},
		{
			id: uid("daily"),
			email: "seed_daily@example.com",
			nickName: "seed_daily",
			fullName: "일상 스냅",
			password: SEED_PASSWORD,
			photo: img.daily,
			follower: 89,
			following: 45,
			followers: [],
			followings: [uid("photo")],
			savedPosts: [],
		},
		{
			id: uid("reels"),
			email: "seed_reels@example.com",
			nickName: "seed_reels",
			fullName: "릴스 크리에이터",
			password: SEED_PASSWORD,
			photo: img.reels,
			follower: 890,
			following: 120,
			followers: [],
			followings: [],
			savedPosts: [],
		},
	];

	const posts = [
		{
			id: "post-feed-1",
			authorId: uid("travel"),
			caption: "주말에 다녀온 카페 ☕️ 햇빛이 너무 좋았어요.",
			contents: [img.travel],
			likeCount: 128,
			likePeople: [uid("photo")],
			createDate: daysAgo(1),
		},
		{
			id: "post-feed-2",
			authorId: uid("photo"),
			caption: "오늘의 스냅 📷 색감 보정만 살짝 했습니다.",
			contents: [img.photo, img.daily],
			likeCount: 256,
			likePeople: [uid("travel"), uid("daily")],
			createDate: daysAgo(2),
		},
		{
			id: "post-feed-3",
			authorId: uid("daily"),
			caption: "집 앞 공원 산책 🌿",
			contents: [img.daily],
			likeCount: 89,
			likePeople: [],
			createDate: daysAgo(3),
		},
		{
			id: "post-feed-4",
			authorId: uid("travel"),
			caption: "비 오는 날의 도심 🌧️",
			contents: [img.travel, img.photo],
			likeCount: 412,
			likePeople: [uid("daily")],
			createDate: daysAgo(4),
		},
		{
			id: "post-feed-5",
			authorId: uid("photo"),
			caption: "필름 감성으로 찍어봤어요.",
			contents: [img.photo],
			likeCount: 67,
			likePeople: [],
			createDate: daysAgo(5),
		},
		{
			id: "post-feed-6",
			authorId: uid("daily"),
			caption: "오늘의 식단 🥗",
			contents: [img.daily, img.travel],
			likeCount: 193,
			likePeople: [uid("photo")],
			createDate: daysAgo(6),
		},
		{
			id: "post-reel-1",
			authorId: uid("reels"),
			caption: "스마트폰으로 찍은 오늘의 순간 📱",
			contents: [reel("reel-01-social.mp4")],
			likeCount: 542,
			likePeople: [uid("travel")],
			createDate: daysAgo(1),
		},
		{
			id: "post-reel-2",
			authorId: uid("reels"),
			caption: "카페 브이로그 ☕️ #릴스 #일상",
			contents: [reel("reel-02-city.mp4")],
			likeCount: 318,
			likePeople: [],
			createDate: daysAgo(2),
		},
		{
			id: "post-reel-3",
			authorId: uid("travel"),
			caption: "바다 노을 🌊 #여행 #릴스",
			contents: [reel("reel-03-travel.mp4")],
			likeCount: 891,
			likePeople: [uid("photo"), uid("daily")],
			createDate: daysAgo(3),
		},
		{
			id: "post-reel-4",
			authorId: uid("photo"),
			caption: "스트릿 패션 스냅 👟",
			contents: [reel("reel-04-fashion.mp4")],
			likeCount: 427,
			likePeople: [],
			createDate: daysAgo(4),
		},
		{
			id: "post-reel-5",
			authorId: uid("daily"),
			caption: "도시의 밤 🌃",
			contents: [reel("reel-05-joy.mp4")],
			likeCount: 673,
			likePeople: [uid("reels")],
			createDate: daysAgo(5),
		},
	];

	const comments = [
		{
			id: "comment-1",
			authorId: uid("photo"),
			parentId: "post-feed-1",
			body: "분위기 너무 좋네요!",
			likeCount: 3,
			likePeople: [],
			modificationDate: daysAgo(1),
		},
	];

	return {
		users,
		posts,
		comments,
		notifications: [],
		conversations: [],
		messages: [],
	};
}
