import express, { Request, Response, NextFunction } from "express";
import mongoose, { Error } from "mongoose";
import multer, { MulterError } from "multer";
import PostSchema from "../models/post";
import CommentSchema from "../models/comment";
import UserSchema from "../models/user";
import removeFiles from "../utils/removeFile";
import {
	formatPosts,
	getPostModel,
	type FormattedPost,
} from "../utils/formatPosts";
import {
	createNotification,
	removeNotification,
} from "../utils/notifications";

const router = express.Router();

type FetchPostsResult =
	| { error: number; message: string }
	| { posts: FormattedPost[] };

async function fetchPosts(
	req: Request,
	query: Record<string, unknown>,
	sort: Record<string, 1 | -1>
): Promise<FetchPostsResult> {
	const { count, max } = req.query;
	if (count === undefined || max === undefined) {
		return { error: 400, message: "There are not queries" };
	}

	const PostModel = getPostModel();
	const posts = await PostModel.find(query)
		.sort(sort)
		.skip(Number(count) * Number(max))
		.limit(Number(max));

	if (posts.length === 0) {
		return { error: 400, message: "There are no posts" };
	}

	const result = await formatPosts(posts, req.user.id);
	return { posts: result };
}

/*
 * 좋아요 수정 api
 * @method GET
 * @query id string
 * @status
 * - [400] The query does not exist.
 * - [500] Unknown error
 */
interface ICommentEditQuery {
	id?: string;
}

router.get("/like", async (req, res) => {
	const { id }: ICommentEditQuery = req.query;

	if (id === undefined) {
		return res.status(400).send({ message: "The query does not exist" });
	}

	try {
		const PostModel = mongoose.model("post", PostSchema);

		const postDoc = await PostModel.findOne({
			_id: id,
		});
		if (postDoc === null) {
			return res.status(400).send({ message: "There is no post" });
		}

		const isPressedLike =
			postDoc.likePeople.findIndex(
				(person) => person.toString() === req.user.id
			) > -1;
		if (isPressedLike) {
			postDoc.likeCount -= 1;
			postDoc.likePeople = postDoc.likePeople.filter(
				(person) => person.toString() !== req.user.id
			);
			await postDoc.save();
			await removeNotification({
				recipientId: postDoc.author.toString(),
				actorId: req.user.id,
				type: "like",
				postId: postDoc.id,
			});
		} else {
			postDoc.likeCount += 1;
			postDoc.likePeople = [...postDoc.likePeople, req.user.id];
			await postDoc.save();
			await createNotification({
				recipientId: postDoc.author.toString(),
				actorId: req.user.id,
				type: "like",
				postId: postDoc.id,
				body: "회원님의 게시물을 좋아합니다.",
			});
		}

		return res.sendStatus(200);
	} catch (e) {
		return res.status(500).send({ message: "Unknown error" });
	}
});

/*
 * 다중 포스트 조회 api
 * @http GET
 * @query max number
 * @query count number
 * @status
 * - [200] {length} 가져온 포스트 갯수
 * - [400] There are not queries ( max나 count가 비어있을 경우 )
 * - [400] There are no posts. ( 포스트를 더 이상 반환할 수 없을 때 )
 * - [500] Unknown error (알 수 없는 오류가 발생했을 때)
 *
 */

interface IPostQuery {
	max?: number;
	count?: number;
}

type ReturnType = {
	id: string;
	author: string;
	caption: string;
	contents?: string[];
	pressLike: boolean;
	likeCount: number;
	commentCount: number;
}[];

router.get("/explore", async (req, res) => {
	try {
		const data = await fetchPosts(req, {}, { likeCount: -1, createDate: -1 });
		if ("error" in data) {
			return res.status(data.error).send({ message: data.message });
		}
		return res.send(data);
	} catch {
		return res.status(500).send({ message: "Unknown error" });
	}
});

router.get("/reels", async (req, res) => {
	try {
		const data = await fetchPosts(
			req,
			{ contents: { $regex: /\/videos\// } },
			{ createDate: -1 }
		);
		if ("error" in data) {
			return res.status(data.error).send({ message: data.message });
		}
		return res.send(data);
	} catch {
		return res.status(500).send({ message: "Unknown error" });
	}
});

router.get("/saved", async (req, res) => {
	const { count, max } = req.query;
	if (count === undefined || max === undefined) {
		return res.status(400).send({ message: "There are not queries" });
	}

	try {
		const UserModel = mongoose.model("user", UserSchema);
		const me = await UserModel.findById(req.user.id);
		if (!me) {
			return res.status(400).send({ message: "User does not exist" });
		}

		const PostModel = getPostModel();
		const posts = await PostModel.find({ _id: { $in: me.savedPosts } })
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

router.get("/save", async (req, res) => {
	const { id } = req.query;
	if (typeof id !== "string") {
		return res.status(400).send({ message: "The query does not exist" });
	}

	try {
		const UserModel = mongoose.model("user", UserSchema);
		const me = await UserModel.findById(req.user.id);
		if (!me) {
			return res.status(400).send({ message: "User does not exist" });
		}

		const isSaved =
			me.savedPosts.findIndex((postId) => postId.toString() === id) > -1;

		if (isSaved) {
			me.savedPosts = me.savedPosts.filter(
				(postId) => postId.toString() !== id
			);
		} else {
			me.savedPosts.push(
				new mongoose.Types.ObjectId(id)
			);
		}

		await me.save();
		return res.send({ saved: !isSaved });
	} catch {
		return res.status(500).send({ message: "Unknown error" });
	}
});

router.get("/activity", async (req, res) => {
	const { count, max } = req.query;
	if (count === undefined || max === undefined) {
		return res.status(400).send({ message: "There are not queries" });
	}

	try {
		const PostModel = getPostModel();
		const posts = await PostModel.find({
			likePeople: req.user.id,
		})
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

router.get("/", async (req, res) => {
	try {
		const data = await fetchPosts(req, {}, { likeCount: -1, createDate: 1 });
		if ("error" in data) {
			return res.status(data.error).send({ message: data.message });
		}
		return res.send(data);
	} catch {
		return res.status(500).send({ message: "Unknown error" });
	}
});

/*
 * 단일 포스트 조회 api
 * @http GET
 * @params id String 포스트의 아이디
 * @status
 * - [200] 성공
 * - [400] There is no id (id 값이 비었을 때)
 * - [400] There is no post (가져올 포스트가 없을 때)
 * - [500] Unknown error (알 수 없는 오류가 발생했을 때)
 */
router.get("/:id", async (req, res) => {
	const { id } = req.params;

	if (id === undefined) {
		return res.status(400).send({
			message: "There is no id",
		});
	}

	const PostModel = mongoose.model("post", PostSchema);
	const post = await PostModel.findById(id);

	if (post === null || post === undefined) {
		return res.status(400).send({ message: "There is no post" });
	}

	const UserModel = mongoose.model("user", UserSchema);
	const CommentModel = mongoose.model("comment", CommentSchema);
	const comments = await CommentModel.find({
		parent: id,
	});

	const userDoc = await UserModel.findById(post.author);
	let commentArray = [];
	for (let i = 0; i < comments.length; i++) {
		const commentUserDoc = await UserModel.findById(comments[i].author);
		commentArray.push({
			id: comments[i].id,
			author: commentUserDoc?.nickName ?? "탈퇴한 사용자",
			authorPhoto: commentUserDoc?.photo ?? "",
			body: comments[i].body,
			likeCount: comments[i].likeCount,
			pressLike:
				comments[i].likePeople.findIndex(
					(person) => person.toString() === req.user.id
				) > -1,
			modificationDate: comments[i].modificationDate,
		});
	}

	return res.send({
		id,
		caption: post.caption,
		author: userDoc?.nickName ?? "탈퇴한 사용자",
		authorId: post.author.toString(),
		authorPhoto: userDoc?.photo ?? "",
		contents: post.contents,
		likeCount: post.likeCount,
		pressLike:
			post.likePeople.findIndex(
				(person) => person.toString() === req.user.id
			) > -1,
		commentCount: commentArray.length,
		comments: commentArray,
		createDate: post.createDate,
	});
});

/*
 * 포스트 업로드 api
 * @http POST
 * @body caption String
 * @files imageList Express.Request.files
 * status
 * - [200]
 * - [400] There are no caption or files (캡션이나 파일이 존재하지 않습니다.)
 * - [400] Caption is longer than 2200 (caption의 길이 제한을 넘었을 경우)
 * - [400] There are too many files (파일의 갯수는 12개로 제한합니다.)
 * - [400] There are too many videos (비디오는 하나만 업로드 가능합니다)
 * - [500] Unknown Error ( 알 수 없는 오류가 발생했을 경우)
 */

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const ext = file.mimetype.split("/")[1];

		if (["mp4", "avi"].includes(ext)) {
			return cb(null, "files/videos");
		}

		if (["png", "jpg", "jpeg"].includes(ext)) {
			return cb(null, "files/images");
		}
	},
	filename: function (req, file, cb) {
		const ext = file.mimetype.split("/")[1];

		const uniqueSuffix =
			(Date.now() + Math.round(Math.random() * 1e9)).toString() +
			"." +
			ext;
		cb(null, uniqueSuffix);
	},
});

const upload = multer({ storage });

function uploadErrorMiddleware(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (err instanceof MulterError) {
		const multerError = err as MulterError;
		console.log(multerError);
		if (multerError.code === "LIMIT_UNEXPECTED_FILE") {
			return res
				.status(400)
				.send({ message: "There are too many files" });
		}
	}

	console.error(err);
	return res.status(500).send({ message: "Unknown error" });
}

interface IPostUploadBody {
	caption: string;
}

router.post(
	"/",
	upload.array("files", 12),
	async (req: Request, res: Response) => {
		const { caption }: IPostUploadBody = req.body;
		const files = req.files as Express.Multer.File[];
		const filePathArray = files.map((file) => file.path);

		if (
			caption === undefined ||
			files === undefined ||
			files.length === 0
		) {
			removeFiles(filePathArray);
			return res
				.status(400)
				.send({ message: "There are no caption or files" });
		}

		if (caption.length > 2200) {
			removeFiles(filePathArray);
			return res
				.status(400)
				.send({ message: "Caption is longer than 2200" });
		}

		let video = 0;
		const fileNameArray = files.map((file) => {
			const ext = file.mimetype.split("/")[1];
			let type = "images";
			if (["mp4", "avi"].includes(ext)) {
				type = "videos";
				video += 1;
			}

			return `http://${process.env.SERVER_ADDRESS}:${process.env.PORT ?? 4000}/${type}/${file.filename}`;
		});

		if (video > 1) {
			removeFiles(filePathArray);
			return res
				.status(400)
				.send({ message: "There are too many videos" });
		}

		try {
			const PostModel = mongoose.model("post", PostSchema);

			await new PostModel({
				author: req.user.id,
				caption,
				contents: fileNameArray,
			}).save();

			return res.sendStatus(200);
		} catch (error) {
			console.log(error);
			return res.status(500).send({
				message: "Unknown error",
			});
		}
	},
	uploadErrorMiddleware
);

export default router;
