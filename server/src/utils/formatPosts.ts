import mongoose from "mongoose";
import PostSchema from "../models/post";
import UserSchema from "../models/user";
import CommentSchema from "../models/comment";

export type FormattedPost = {
	id: string;
	author: string;
	authorId: string;
	authorPhoto: string;
	caption: string;
	contents?: string[];
	pressLike: boolean;
	likeCount: number;
	commentCount: number;
	createDate?: Date;
};

export async function formatPosts(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	postDocs: any[],
	userId: string
): Promise<FormattedPost[]> {
	const UserModel = mongoose.model("user", UserSchema);
	const CommentModel = mongoose.model("comment", CommentSchema);
	const result: FormattedPost[] = [];

	for (const post of postDocs) {
		const postDoc = post as {
			_id: mongoose.Types.ObjectId;
			id: string;
			author: mongoose.Types.ObjectId;
			caption: string;
			contents?: string[];
			likePeople: mongoose.Types.ObjectId[];
			likeCount: number;
			createDate?: Date;
		};

		const userDoc = await UserModel.findById(postDoc.author);
		const commentDoc = await CommentModel.find({ parent: postDoc._id });

		result.push({
			id: postDoc.id,
			author: userDoc?.nickName ?? "탈퇴한 사용자",
			authorId: postDoc.author.toString(),
			authorPhoto: userDoc?.photo ?? "",
			caption: postDoc.caption,
			contents: postDoc.contents,
			pressLike:
				postDoc.likePeople.findIndex(
					(person) => person.toString() === userId
				) > -1,
			likeCount: postDoc.likeCount,
			commentCount: commentDoc.length,
			createDate: postDoc.createDate,
		});
	}

	return result;
}

export function getPostModel() {
	return mongoose.model("post", PostSchema);
}
