export type MockUser = {
	id: string;
	email?: string;
	phone?: string;
	nickName: string;
	fullName: string;
	password: string;
	photo: string;
	follower: number;
	following: number;
	followers: string[];
	followings: string[];
	savedPosts: string[];
};

export type MockPost = {
	id: string;
	authorId: string;
	caption: string;
	contents: string[];
	likeCount: number;
	likePeople: string[];
	createDate: string;
};

export type MockComment = {
	id: string;
	authorId: string;
	parentId: string;
	body: string;
	likeCount: number;
	likePeople: string[];
	modificationDate: string;
};

export type MockNotification = {
	id: string;
	type: "follow" | "like" | "comment" | "message";
	actorId: string;
	recipientId: string;
	body?: string;
	postId?: string;
	conversationId?: string;
	createdAt: string;
};

export type MockConversation = {
	id: string;
	participants: string[];
	lastMessage: string;
	updatedAt: string;
};

export type MockMessage = {
	id: string;
	conversationId: string;
	senderId: string;
	body: string;
	createdAt: string;
};

export type MockDatabase = {
	users: MockUser[];
	posts: MockPost[];
	comments: MockComment[];
	notifications: MockNotification[];
	conversations: MockConversation[];
	messages: MockMessage[];
};
