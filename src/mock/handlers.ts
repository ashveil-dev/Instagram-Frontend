import type { InternalAxiosRequestConfig } from "axios";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/profileImages";
import { mockPublicUrl } from "./mediaUrl";
import { loadDatabase, saveDatabase } from "./db";
import {
	createMockTokens,
	getUserIdFromAuth,
	parseMockAccessToken,
} from "./tokens";
import { createInitialDatabase } from "./seedData";
import type {
	MockDatabase,
	MockPost,
	MockUser,
	MockNotification,
} from "./types";

function newId(prefix: string) {
	return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function ok<T>(config: InternalAxiosRequestConfig, data: T, status = 200) {
	return {
		data,
		status,
		statusText: "OK",
		headers: {},
		config,
	};
}

function fail(
	config: InternalAxiosRequestConfig,
	message: string,
	status = 400
) {
	return {
		data: { message },
		status,
		statusText: "Error",
		headers: {},
		config,
	};
}

function getPath(config: InternalAxiosRequestConfig): string {
	let url = config.url ?? "";
	if (url.startsWith("http")) {
		try {
			const parsed = new URL(url);
			url = parsed.pathname + parsed.search;
		} catch {
			/* keep url */
		}
	}
	const marker = "/api";
	const idx = url.indexOf(marker);
	if (idx >= 0) {
		url = url.slice(idx + marker.length);
	}
	if (!url.startsWith("/")) {
		url = `/${url}`;
	}
	return url.split("?")[0];
}

function requireAuth(
	config: InternalAxiosRequestConfig,
	db: MockDatabase
): { userId: string; user: MockUser } | ReturnType<typeof fail> {
	const userId = getUserIdFromAuth(
		config.headers?.Authorization as string | undefined
	);
	if (!userId) {
		return fail(config, "AccessToken is empty", 400);
	}
	const user = db.users.find((u) => u.id === userId);
	if (!user) {
		return fail(config, "User does not exist", 400);
	}
	return { userId, user };
}

function formatPost(post: MockPost, db: MockDatabase, viewerId: string) {
	const author = db.users.find((u) => u.id === post.authorId);
	const comments = db.comments
		.filter((c) => c.parentId === post.id)
		.map((c) => {
			const ca = db.users.find((u) => u.id === c.authorId);
			return {
				id: c.id,
				author: ca?.nickName ?? "",
				authorPhoto: ca?.photo,
				body: c.body,
				likeCount: c.likeCount,
				pressLike: c.likePeople.includes(viewerId),
				modificationDate: new Date(c.modificationDate),
			};
		});

	return {
		id: post.id,
		author: author?.nickName ?? "",
		authorId: post.authorId,
		authorPhoto: author?.photo,
		caption: post.caption,
		contents: post.contents,
		pressLike: post.likePeople.includes(viewerId),
		likeCount: post.likeCount,
		commentCount: comments.length,
		createDate: post.createDate,
		comments,
	};
}

function formatPosts(
	posts: MockPost[],
	db: MockDatabase,
	viewerId: string
) {
	return posts.map((p) => formatPost(p, db, viewerId));
}

function paginate<T>(items: T[], count: number, max: number) {
	const start = count * max;
	return items.slice(start, start + max);
}

async function readFormDataFiles(
	formData: FormData
): Promise<string[]> {
	const urls: string[] = [];
	for (const [, value] of formData.entries()) {
		if (value instanceof File) {
			const url = await fileToDataUrl(value);
			urls.push(url);
		}
	}
	return urls;
}

function fileToDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

function findUserByLoginId(db: MockDatabase, id: string) {
	const emailReg = /[^@]+@.+/;
	const phoneReg = /01[0-9]{9}/;
	if (emailReg.test(id)) {
		return db.users.find((u) => u.email === id);
	}
	if (phoneReg.test(id)) {
		return db.users.find((u) => u.phone === id);
	}
	return db.users.find((u) => u.nickName === id);
}

function pushNotification(
	db: MockDatabase,
	n: Omit<MockNotification, "id" | "createdAt">
) {
	if (n.actorId === n.recipientId) return;
	db.notifications.unshift({
		...n,
		id: newId("noti"),
		createdAt: new Date().toISOString(),
	});
}

export async function handleMockRequest(
	config: InternalAxiosRequestConfig
) {
	await new Promise((r) => setTimeout(r, 80 + Math.random() * 120));

	const db = loadDatabase();
	const path = getPath(config);
	const method = (config.method ?? "get").toLowerCase();

	/* ---------- Auth (no token) ---------- */
	if (method === "post" && path === "/user/signIn") {
		const { id, password } = config.data as { id: string; password: string };
		if (!id || !password) {
			return fail(config, "Inputs are invalid");
		}
		const user = findUserByLoginId(db, id);
		if (!user) {
			return fail(config, "User does not exist", 401);
		}
		if (user.password !== password) {
			return fail(config, "Password is not correct", 401);
		}
		return ok(
			config,
			createMockTokens({
				id: user.id,
				nickName: user.nickName,
				fullName: user.fullName,
				photo: user.photo,
			})
		);
	}

	if (method === "post" && path === "/user/signUp") {
		const body = config.data as {
			phoneOrEmail: string;
			fullName: string;
			nickName: string;
			password: string;
		};
		if (!body?.phoneOrEmail || !body?.nickName || !body?.password) {
			return fail(config, "Inputs are invalid");
		}
		const emailReg = /[^@]+@.+/;
		const phoneReg = /01[0-9]{9}/;
		let key: "email" | "phone" | null = null;
		if (emailReg.test(body.phoneOrEmail)) key = "email";
		else if (phoneReg.test(body.phoneOrEmail)) key = "phone";
		else return fail(config, "Inputs are invalid");

		if (db.users.some((u) => u.nickName === body.nickName)) {
			return fail(config, "Nickname already exists", 401);
		}
		if (
			db.users.some(
				(u) =>
					(key === "email" && u.email === body.phoneOrEmail) ||
					(key === "phone" && u.phone === body.phoneOrEmail)
			)
		) {
			return fail(
				config,
				`${key === "email" ? "Email" : "Phone"} already exists`,
				401
			);
		}

		const user: MockUser = {
			id: newId("user"),
			[key]: body.phoneOrEmail,
			nickName: body.nickName,
			fullName: body.fullName,
			password: body.password,
			photo: mockPublicUrl(DEFAULT_PROFILE_IMAGE),
			follower: 0,
			following: 0,
			followers: [],
			followings: [],
			savedPosts: [],
		};
		db.users.push(user);
		saveDatabase(db);
		return ok(
			config,
			createMockTokens({
				id: user.id,
				nickName: user.nickName,
				fullName: user.fullName,
				photo: user.photo,
			})
		);
	}

	if (method === "post" && path === "/user/check") {
		const { accessToken, refreshToken } = config.data as {
			accessToken: string | null;
			refreshToken: string | null;
		};
		if (!accessToken) {
			return fail(config, "AccessToken is required");
		}
		const payload = parseMockAccessToken(accessToken);
		if (payload) {
			return ok(config, { accessToken });
		}
		if (!refreshToken) {
			return fail(config, "RefreshToken is required");
		}
		const refreshPayload = parseMockAccessToken(
			refreshToken.replace(/\.refresh$/, "")
		);
		if (!refreshPayload) {
			return fail(config, "RefreshToken has expired", 401);
		}
		const user = db.users.find((u) => u.id === refreshPayload.id);
		if (!user) {
			return fail(config, "User does not exist", 401);
		}
		const tokens = createMockTokens({
			id: user.id,
			nickName: user.nickName,
			fullName: user.fullName,
			photo: user.photo,
		});
		return ok(config, { accessToken: tokens.accessToken });
	}

	const auth = requireAuth(config, db);
	if (!("userId" in auth)) {
		return auth;
	}
	const { userId, user: me } = auth;

	/* ---------- Users ---------- */
	if (method === "get" && path === "/user/search") {
		const q = String(config.params?.q ?? "").trim();
		if (!q) return fail(config, "Query is required");
		const users = db.users
			.filter(
				(u) =>
					u.id !== userId &&
					u.nickName.toLowerCase().includes(q.toLowerCase())
			)
			.slice(0, 20)
			.map((u) => ({
				id: u.id,
				nickName: u.nickName,
				fullName: u.fullName,
				photo: u.photo,
				follower: u.follower,
			}));
		return ok(config, { users });
	}

	if (method === "get" && path === "/user/suggestions") {
		const users = db.users
			.filter((u) => u.id !== userId)
			.sort((a, b) => b.follower - a.follower)
			.slice(0, 10)
			.map((u) => ({
				id: u.id,
				nickName: u.nickName,
				fullName: u.fullName,
				photo: u.photo,
				follower: u.follower,
			}));
		return ok(config, { users });
	}

	if (method === "get" && path === "/user/me") {
		const postCount = db.posts.filter((p) => p.authorId === userId).length;
		return ok(config, {
			id: me.id,
			nickName: me.nickName,
			fullName: me.fullName,
			photo: me.photo,
			follower: me.follower,
			following: me.following,
			postCount,
			isMe: true,
		});
	}

	const profileMatch = path.match(/^\/user\/profile\/([^/]+)$/);
	if (method === "get" && profileMatch) {
		const target = db.users.find((u) => u.nickName === profileMatch[1]);
		if (!target) return fail(config, "User does not exist");
		const postCount = db.posts.filter((p) => p.authorId === target.id).length;
		return ok(config, {
			id: target.id,
			nickName: target.nickName,
			fullName: target.fullName,
			photo: target.photo,
			follower: target.follower,
			following: target.following,
			postCount,
			isFollowing: target.followers.includes(userId),
			isMe: target.id === userId,
		});
	}

	const profilePostsMatch = path.match(/^\/user\/profile\/([^/]+)\/posts$/);
	if (method === "get" && profilePostsMatch) {
		const count = Number(config.params?.count ?? 0);
		const max = Number(config.params?.max ?? 10);
		const target = db.users.find((u) => u.nickName === profilePostsMatch[1]);
		if (!target) return fail(config, "User does not exist");
		const all = db.posts
			.filter((p) => p.authorId === target.id)
			.sort(
				(a, b) =>
					new Date(b.createDate).getTime() -
					new Date(a.createDate).getTime()
			);
		const slice = paginate(all, count, max);
		if (slice.length === 0) {
			return fail(config, "There are no posts");
		}
		return ok(config, { posts: formatPosts(slice, db, userId) });
	}

	if (method === "post" && path === "/user/follow") {
		const { id } = config.data as { id: string };
		if (!id) return fail(config, "Inputs are invalid");
		if (id === userId) return fail(config, "Cannot follow yourself");
		const target = db.users.find((u) => u.id === id);
		if (!target) return fail(config, "User does not exist");
		const isFollowing = me.followings.includes(id);
		if (isFollowing) {
			me.followings = me.followings.filter((x) => x !== id);
			me.following = Math.max(0, me.following - 1);
			target.followers = target.followers.filter((x) => x !== userId);
			target.follower = Math.max(0, target.follower - 1);
		} else {
			me.followings.push(id);
			me.following += 1;
			target.followers.push(userId);
			target.follower += 1;
			pushNotification(db, {
				type: "follow",
				actorId: userId,
				recipientId: id,
				body: "회원님을 팔로우하기 시작했습니다.",
			});
		}
		saveDatabase(db);
		return ok(config, {
			isFollowing: !isFollowing,
			follower: target.follower,
		});
	}

	if (method === "post" && path === "/user/photo") {
		const formData = config.data as FormData;
		if (formData instanceof FormData) {
			const files = await readFormDataFiles(formData);
			if (files[0]) {
				me.photo = files[0];
				saveDatabase(db);
			}
		}
		return ok(config, { photo: me.photo });
	}

	/* ---------- Posts ---------- */
	const listPosts = (
		filter: (p: MockPost) => boolean,
		sort: (a: MockPost, b: MockPost) => number
	) => {
		const count = Number(config.params?.count ?? 0);
		const max = Number(config.params?.max ?? 10);
		const all = db.posts.filter(filter).sort(sort);
		const slice = paginate(all, count, max);
		if (slice.length === 0) {
			return fail(config, "There are no posts");
		}
		return ok(config, { posts: formatPosts(slice, db, userId) });
	};

	if (method === "get" && path === "/post") {
		return listPosts(
			() => true,
			(a, b) =>
				b.likeCount - a.likeCount ||
				new Date(a.createDate).getTime() -
					new Date(b.createDate).getTime()
		);
	}
	if (method === "get" && path === "/post/explore") {
		return listPosts(
			() => true,
			(a, b) =>
				b.likeCount - a.likeCount ||
				new Date(b.createDate).getTime() -
					new Date(a.createDate).getTime()
		);
	}
	if (method === "get" && path === "/post/reels") {
		return listPosts(
			(p) => p.contents.some((c) => /\/videos\//i.test(c)),
			(a, b) =>
				new Date(b.createDate).getTime() -
				new Date(a.createDate).getTime()
		);
	}
	if (method === "get" && path === "/post/saved") {
		return listPosts(
			(p) => me.savedPosts.includes(p.id),
			(a, b) =>
				new Date(b.createDate).getTime() -
				new Date(a.createDate).getTime()
		);
	}
	if (method === "get" && path === "/post/activity") {
		return listPosts(
			(p) => p.likePeople.includes(userId),
			(a, b) =>
				new Date(b.createDate).getTime() -
				new Date(a.createDate).getTime()
		);
	}

	if (method === "get" && path === "/post/like") {
		const id = String(config.params?.id ?? "");
		const post = db.posts.find((p) => p.id === id);
		if (!post) return fail(config, "There is no post");
		const liked = post.likePeople.includes(userId);
		if (liked) {
			post.likePeople = post.likePeople.filter((x) => x !== userId);
			post.likeCount = Math.max(0, post.likeCount - 1);
		} else {
			post.likePeople.push(userId);
			post.likeCount += 1;
			if (post.authorId !== userId) {
				pushNotification(db, {
					type: "like",
					actorId: userId,
					recipientId: post.authorId,
					postId: post.id,
					body: "회원님의 게시물을 좋아합니다.",
				});
			}
		}
		saveDatabase(db);
		return ok(config, {}, 200);
	}

	if (method === "get" && path === "/post/save") {
		const id = String(config.params?.id ?? "");
		if (!me.savedPosts.includes(id)) {
			me.savedPosts.push(id);
		} else {
			me.savedPosts = me.savedPosts.filter((x) => x !== id);
		}
		saveDatabase(db);
		return ok(config, { saved: me.savedPosts.includes(id) });
	}

	if (method === "post" && path === "/post") {
		let contents: string[] = [];
		let caption = "";
		if (config.data instanceof FormData) {
			caption = String(config.data.get("caption") ?? "");
			contents = await readFormDataFiles(config.data);
		}
		const post: MockPost = {
			id: newId("post"),
			authorId: userId,
			caption,
			contents,
			likeCount: 0,
			likePeople: [],
			createDate: new Date().toISOString(),
		};
		db.posts.unshift(post);
		saveDatabase(db);
		return ok(config, {}, 200);
	}

	const singlePostMatch = path.match(/^\/post\/([^/]+)$/);
	if (method === "get" && singlePostMatch && singlePostMatch[1] !== "like") {
		const post = db.posts.find((p) => p.id === singlePostMatch[1]);
		if (!post) return fail(config, "There is no post");
		return ok(config, formatPost(post, db, userId));
	}

	/* ---------- Comments ---------- */
	if (method === "post" && path === "/comment") {
		const { id, body } = config.data as { id: string; body: string };
		if (!id || !body) return fail(config, "There are no bodies");
		const post = db.posts.find((p) => p.id === id);
		if (!post) return fail(config, "There is no post");
		db.comments.push({
			id: newId("comment"),
			authorId: userId,
			parentId: id,
			body,
			likeCount: 0,
			likePeople: [],
			modificationDate: new Date().toISOString(),
		});
		if (post.authorId !== userId) {
			pushNotification(db, {
				type: "comment",
				actorId: userId,
				recipientId: post.authorId,
				postId: id,
				body,
			});
		}
		saveDatabase(db);
		return ok(config, {}, 200);
	}

	if (method === "get" && path === "/comment/like") {
		const id = String(config.params?.id ?? "");
		const comment = db.comments.find((c) => c.id === id);
		if (!comment) return fail(config, "There is no comment");
		const liked = comment.likePeople.includes(userId);
		if (liked) {
			comment.likePeople = comment.likePeople.filter((x) => x !== userId);
			comment.likeCount = Math.max(0, comment.likeCount - 1);
		} else {
			comment.likePeople.push(userId);
			comment.likeCount += 1;
		}
		saveDatabase(db);
		return ok(config, {}, 200);
	}

	/* ---------- Notifications ---------- */
	if (method === "get" && path === "/notification") {
		const notifications = db.notifications
			.filter((n) => n.recipientId === userId)
			.slice(0, 30)
			.map((n) => {
				const actor = db.users.find((u) => u.id === n.actorId)!;
				return {
					id: n.id,
					type: n.type,
					author: actor.nickName,
					authorId: actor.id,
					authorPhoto: actor.photo,
					body: n.body,
					postId: n.postId,
					conversationId: n.conversationId,
					createdAt: n.createdAt,
				};
			})
		return ok(config, { notifications });
	}

	/* ---------- Messages ---------- */
	if (method === "get" && path === "/message/conversations") {
		const conversations = db.conversations
			.filter((c) => c.participants.includes(userId))
			.sort(
				(a, b) =>
					new Date(b.updatedAt).getTime() -
					new Date(a.updatedAt).getTime()
			)
			.map((c) => {
				const otherId = c.participants.find((p) => p !== userId)!;
				const other = db.users.find((u) => u.id === otherId)!;
				const unread = db.messages.filter(
					(m) =>
						m.conversationId === c.id && m.senderId !== userId
				).length;
				return {
					id: c.id,
					nickName: other.nickName,
					fullName: other.fullName,
					photo: other.photo,
					lastMessage: c.lastMessage,
					updatedAt: c.updatedAt,
					unreadCount: unread,
				};
			});
		return ok(config, { conversations });
	}

	if (method === "post" && path === "/message/conversations") {
		const { recipientId } = config.data as { recipientId: string };
		const recipient = db.users.find((u) => u.id === recipientId);
		if (!recipient) return fail(config, "User does not exist");
		let conv = db.conversations.find(
			(c) =>
				c.participants.includes(userId) &&
				c.participants.includes(recipientId)
		);
		if (!conv) {
			conv = {
				id: newId("conv"),
				participants: [userId, recipientId],
				lastMessage: "",
				updatedAt: new Date().toISOString(),
			};
			db.conversations.push(conv);
			saveDatabase(db);
		}
		return ok(config, {
			id: conv.id,
			nickName: recipient.nickName,
			fullName: recipient.fullName,
			photo: recipient.photo,
			lastMessage: conv.lastMessage,
			updatedAt: conv.updatedAt,
		});
	}

	const messagesMatch = path.match(
		/^\/message\/conversations\/([^/]+)\/messages$/
	);
	if (messagesMatch) {
		const convId = messagesMatch[1];
		const conv = db.conversations.find((c) => c.id === convId);
		if (!conv || !conv.participants.includes(userId)) {
			return fail(config, "Conversation not found");
		}
		const otherId = conv.participants.find((p) => p !== userId)!;
		const other = db.users.find((u) => u.id === otherId)!;

		if (method === "get") {
			const messages = db.messages
				.filter((m) => m.conversationId === convId)
				.sort(
					(a, b) =>
						new Date(a.createdAt).getTime() -
						new Date(b.createdAt).getTime()
				)
				.map((m) => ({
					id: m.id,
					body: m.body,
					senderId: m.senderId,
					isMine: m.senderId === userId,
					createdAt: m.createdAt,
				}));
			return ok(config, {
				conversation: {
					id: conv.id,
					nickName: other.nickName,
					photo: other.photo,
				},
				messages,
			});
		}

		if (method === "post") {
			const { body } = config.data as { body: string };
			if (!body?.trim()) return fail(config, "Inputs are invalid");
			const msg = {
				id: newId("msg"),
				conversationId: convId,
				senderId: userId,
				body: body.trim(),
				createdAt: new Date().toISOString(),
			};
			db.messages.push(msg);
			conv.lastMessage = body.trim();
			conv.updatedAt = msg.createdAt;
			if (otherId !== userId) {
				pushNotification(db, {
					type: "message",
					actorId: userId,
					recipientId: otherId,
					conversationId: convId,
					body: body.trim(),
				});
			}
			saveDatabase(db);
			return ok(config, {
				id: msg.id,
				body: msg.body,
				senderId: msg.senderId,
				isMine: true,
				createdAt: msg.createdAt,
			});
		}
	}

	/* ---------- Reset (dev) ---------- */
	if (method === "post" && path === "/mock/reset") {
		const fresh = createInitialDatabase();
		saveDatabase(fresh);
		return ok(config, { ok: true });
	}

	return fail(config, `Mock API: ${method.toUpperCase()} ${path} not found`, 404);
}
