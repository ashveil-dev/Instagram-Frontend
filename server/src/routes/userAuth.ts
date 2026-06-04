import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import multer, { MulterError } from "multer";
import UserSchema from "../models/user";
import {
	createNotification,
	removeNotification,
} from "../utils/notifications";
import { formatPosts, getPostModel } from "../utils/formatPosts";
import removeFiles from "../utils/removeFile";
import {
	buildMediaUrl,
	photoUrlToLocalPath,
} from "../utils/buildMediaUrl";

const router = express.Router();

const profileStorage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, "files/images");
	},
	filename: (_req, file, cb) => {
		const ext = file.mimetype.split("/")[1] ?? "jpg";
		const uniqueSuffix =
			`profile-${Date.now()}-${Math.round(Math.random() * 1e9)}.` +
			ext;
		cb(null, uniqueSuffix);
	},
});

const profileUpload = multer({
	storage: profileStorage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (_req, file, cb) => {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
			return;
		}
		cb(new Error("Only image files are allowed"));
	},
});

function profileUploadErrorMiddleware(
	err: Error,
	_req: Request,
	res: Response,
	next: NextFunction
) {
	if (err instanceof MulterError) {
		if (err.code === "LIMIT_FILE_SIZE") {
			return res
				.status(400)
				.send({ message: "Image file is too large" });
		}
		return res.status(400).send({ message: "Invalid image upload" });
	}

	if (err.message === "Only image files are allowed") {
		return res.status(400).send({ message: "Only image files are allowed" });
	}

	return res.status(500).send({ message: "Unknown error" });
}

router.get("/search", async (req, res) => {
	const { q } = req.query;
	if (typeof q !== "string" || q.trim() === "") {
		return res.status(400).send({ message: "Query is required" });
	}

	try {
		const UserModel = mongoose.model("user", UserSchema);
		const users = await UserModel.find({
			_id: { $ne: req.user.id },
			nickName: { $regex: q.trim(), $options: "i" },
		})
			.limit(20)
			.select({ nickName: 1, fullName: 1, photo: 1, follower: 1 });

		return res.send({
			users: users.map((user) => ({
				id: user.id,
				nickName: user.nickName,
				fullName: user.fullName,
				photo: user.photo,
				follower: user.follower,
			})),
		});
	} catch {
		return res.status(500).send({ message: "Unknown error" });
	}
});

router.get("/suggestions", async (req, res) => {
	try {
		const UserModel = mongoose.model("user", UserSchema);
		const users = await UserModel.find({ _id: { $ne: req.user.id } })
			.sort({ follower: -1 })
			.limit(10)
			.select({ nickName: 1, fullName: 1, photo: 1, follower: 1 });

		return res.send({
			users: users.map((user) => ({
				id: user.id,
				nickName: user.nickName,
				fullName: user.fullName,
				photo: user.photo,
				follower: user.follower,
			})),
		});
	} catch {
		return res.status(500).send({ message: "Unknown error" });
	}
});

router.get("/me", async (req, res) => {
	try {
		const UserModel = mongoose.model("user", UserSchema);
		const user = await UserModel.findById(req.user.id);
		if (!user) {
			return res.status(400).send({ message: "User does not exist" });
		}

		const PostModel = getPostModel();
		const postCount = await PostModel.countDocuments({ author: user.id });

		return res.send({
			id: user.id,
			nickName: user.nickName,
			fullName: user.fullName,
			photo: user.photo,
			follower: user.follower,
			following: user.following,
			postCount,
			isMe: true,
		});
	} catch {
		return res.status(500).send({ message: "Unknown error" });
	}
});

router.get("/profile/:nickName", async (req, res) => {
	const { nickName } = req.params;

	try {
		const UserModel = mongoose.model("user", UserSchema);
		const user = await UserModel.findOne({ nickName });
		if (!user) {
			return res.status(400).send({ message: "User does not exist" });
		}

		const PostModel = getPostModel();
		const postCount = await PostModel.countDocuments({ author: user.id });
		const isFollowing =
			user.followers.findIndex(
				(id) => id.toString() === req.user.id
			) > -1;

		return res.send({
			id: user.id,
			nickName: user.nickName,
			fullName: user.fullName,
			photo: user.photo,
			follower: user.follower,
			following: user.following,
			postCount,
			isFollowing,
			isMe: user.id === req.user.id,
		});
	} catch {
		return res.status(500).send({ message: "Unknown error" });
	}
});

router.get("/profile/:nickName/posts", async (req, res) => {
	const { nickName } = req.params;
	const { max, count } = req.query;

	if (count === undefined || max === undefined) {
		return res.status(400).send({ message: "There are not queries" });
	}

	try {
		const UserModel = mongoose.model("user", UserSchema);
		const user = await UserModel.findOne({ nickName });
		if (!user) {
			return res.status(400).send({ message: "User does not exist" });
		}

		const PostModel = getPostModel();
		const posts = await PostModel.find({ author: user.id })
			.sort({ createDate: -1 })
			.skip(Number(count) * Number(max))
			.limit(Number(max));

		if (posts.length === 0) {
			return res.status(400).send({ message: "There are no posts" });
		}

		const result = await formatPosts(posts, req.user.id);
		return res.send({ posts: result });
	} catch {
		return res.status(500).send({ message: "Unknown error" });
	}
});

router.post("/follow", async (req, res) => {
	const { id } = req.body;
	if (id === undefined) {
		return res.status(400).send({ message: "Inputs are invalid" });
	}
	if (id === req.user.id) {
		return res.status(400).send({ message: "Cannot follow yourself" });
	}

	try {
		const UserModel = mongoose.model("user", UserSchema);
		const me = await UserModel.findById(req.user.id);
		const target = await UserModel.findById(id);

		if (!me || !target) {
			return res.status(400).send({ message: "User does not exist" });
		}

		const isFollowing =
			me.followings.findIndex((userId) => userId.toString() === id) > -1;

		if (isFollowing) {
			me.followings = me.followings.filter(
				(userId) => userId.toString() !== id
			);
			me.following = Math.max(0, me.following - 1);
			target.followers = target.followers.filter(
				(userId) => userId.toString() !== req.user.id
			);
			target.follower = Math.max(0, target.follower - 1);
			await removeNotification({
				recipientId: id,
				actorId: req.user.id,
				type: "follow",
			});
		} else {
			me.followings.push(target._id);
			me.following += 1;
			target.followers.push(me._id);
			target.follower += 1;
			await createNotification({
				recipientId: id,
				actorId: req.user.id,
				type: "follow",
				body: "회원님을 팔로우하기 시작했습니다.",
			});
		}

		await me.save();
		await target.save();

		return res.send({
			isFollowing: !isFollowing,
			follower: target.follower,
		});
	} catch {
		return res.status(500).send({ message: "Unknown error" });
	}
});

router.post(
	"/photo",
	profileUpload.single("photo"),
	async (req: Request, res: Response) => {
		const file = req.file;

		if (file === undefined) {
			return res.status(400).send({ message: "There are no files" });
		}

		try {
			const UserModel = mongoose.model("user", UserSchema);
			const user = await UserModel.findById(req.user.id);

			if (!user) {
				removeFiles([file.path]);
				return res.status(400).send({ message: "User does not exist" });
			}

			const previousPath = photoUrlToLocalPath(user.photo);
			const photo = buildMediaUrl(`images/${file.filename}`);
			user.photo = photo;
			await user.save();

			if (previousPath) {
				removeFiles([previousPath]);
			}

			return res.send({ photo });
		} catch {
			removeFiles([file.path]);
			return res.status(500).send({ message: "Unknown error" });
		}
	},
	profileUploadErrorMiddleware
);

export default router;
