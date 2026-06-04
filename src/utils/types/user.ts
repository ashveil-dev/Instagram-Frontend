export interface ILoginData {
	id: string;
	password: string;
}

export interface ILoginResponse {
	accessToken: string;
	refreshToken: string;
}

export interface IRegisterData {
	phoneOrEmail: string;
	fullName: string;
	nickName: string;
	password: string;
}

export interface IRegisterResponse {
	accessToken: string;
	refreshToken: string;
}

export interface ICheckData {
	accessToken: string | null;
	refreshToken: string | null;
}

export interface IUserSummary {
	id: string;
	nickName: string;
	fullName: string;
	photo: string;
	follower?: number;
}

export interface IUserProfile extends IUserSummary {
	following: number;
	postCount: number;
	isFollowing?: boolean;
	isMe?: boolean;
}

export interface INotificationItem {
	id: string;
	type: "follow" | "like" | "comment" | "message";
	author: string;
	authorId: string;
	authorPhoto: string;
	body?: string;
	postId?: string;
	conversationId?: string;
	createdAt: string;
}

export interface IConversation {
	id: string;
	nickName: string;
	fullName: string;
	photo: string;
	lastMessage: string;
	updatedAt: string;
	unreadCount: number;
}

export interface IMessage {
	id: string;
	body: string;
	senderId: string;
	isMine: boolean;
	createdAt: string;
}
