import mongoose from "mongoose";
import UserSchema from "../models/user";
import PostSchema from "../models/post";
import CommentSchema from "../models/comment";
import { getDefaultProfilePhotoUrl } from "../utils/buildMediaUrl";
import {
	seedUsers,
	SEED_USER_PASSWORD,
	getSeedUserPhoto,
} from "./data/users.seed";
import { seedFeedPosts, getFeedContents } from "./data/feed.seed";
import { seedReelPosts, getReelContents } from "./data/reels.seed";
import {
	ensureDirectories,
	ensureUnsplashProfileImages,
	ensureReelVideos,
} from "./ensureAssets";

const SEED_TAG = "[seed]";

export type RunSeedOptions = {
	reset?: boolean;
	skipAssets?: boolean;
};

export async function runSeed(options: RunSeedOptions = {}): Promise<void> {
	const { reset = false, skipAssets = false } = options;

	if (!skipAssets) {
		console.log("[seed] Preparing assets...");
		ensureDirectories();
		ensureUnsplashProfileImages();
		await ensureReelVideos();
	}

	const UserModel = mongoose.model("user", UserSchema);
	const PostModel = mongoose.model("post", PostSchema);
	const CommentModel = mongoose.model("comment", CommentSchema);

	if (reset) {
		console.log("[seed] Resetting seed data...");
		const seedUserIds = await UserModel.find({
			nickName: { $regex: /^seed_/ },
		}).distinct("_id");

		await PostModel.deleteMany({
			$or: [
				{ caption: { $regex: /^\[seed\]/ } },
				{ author: { $in: seedUserIds } },
			],
		});
		await CommentModel.deleteMany({ body: { $regex: /^\[seed\]/ } });
		await UserModel.deleteMany({ nickName: { $regex: /^seed_/ } });
	}

	const userIdByNick = new Map<string, mongoose.Types.ObjectId>();

	for (const user of seedUsers) {
		let doc = await UserModel.findOne({ nickName: user.nickName });
		if (!doc) {
			doc = await new UserModel({
				email: user.email,
				fullName: user.fullName,
				nickName: user.nickName,
				password: SEED_USER_PASSWORD,
				photo: getSeedUserPhoto(user.photoPath),
			}).save();
			console.log(`[seed] Created user: ${user.nickName}`);
		} else {
			doc.photo = getSeedUserPhoto(user.photoPath);
			await doc.save();
			console.log(`[seed] Updated user: ${user.nickName}`);
		}
		userIdByNick.set(user.nickName, doc._id);
	}

	const existingSeedPosts = await PostModel.countDocuments({
		caption: { $regex: /^\[seed\]/ },
	});

	if (existingSeedPosts > 0 && !reset) {
		console.log(
			`[seed] Seed posts already exist (${existingSeedPosts}). Skipping post insert.`
		);
	} else {
		let feedCount = 0;
		for (const post of seedFeedPosts) {
			const authorId = userIdByNick.get(post.authorNickName);
			if (!authorId) continue;

			await new PostModel({
				author: authorId,
				caption: `${SEED_TAG} ${post.caption}`,
				contents: getFeedContents(post.imageFiles),
				likeCount: post.likeCount,
				createDate: daysAgo(post.daysAgo),
			}).save();
			feedCount += 1;
		}

		let reelCount = 0;
		for (const post of seedReelPosts) {
			const authorId = userIdByNick.get(post.authorNickName);
			if (!authorId) continue;

			await new PostModel({
				author: authorId,
				caption: `${SEED_TAG} ${post.caption}`,
				contents: getReelContents(post.videoFile),
				likeCount: post.likeCount,
				createDate: daysAgo(post.daysAgo),
			}).save();
			reelCount += 1;
		}

		const travelId = userIdByNick.get("seed_travel");
		const photoId = userIdByNick.get("seed_photo");
		if (travelId && photoId) {
			const firstFeed = await PostModel.findOne({
				caption: { $regex: /^\[seed\].*카페/ },
			});
			if (firstFeed) {
				const existingComment = await CommentModel.findOne({
					body: { $regex: /^\[seed\].*분위기/ },
					parent: firstFeed._id,
				});
				if (!existingComment) {
					await new CommentModel({
						author: photoId,
						parent: firstFeed._id,
						body: `${SEED_TAG} 분위기 너무 좋네요!`,
					}).save();
				}
			}
		}

		console.log(
			`[seed] Inserted ${feedCount} feed posts, ${reelCount} reel posts.`
		);
	}

	console.log("\n[seed] Demo accounts (password: password123)");
	for (const user of seedUsers) {
		console.log(`  - ${user.nickName} (${user.email})`);
	}
	console.log(`[seed] Default profile: ${getDefaultProfilePhotoUrl()}`);
}

function daysAgo(days: number) {
	const date = new Date();
	date.setDate(date.getDate() - days);
	return date;
}
