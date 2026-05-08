export interface IGetFeedListParams {
	max: number;
	count: number;
}

export interface IFeedData {
	id: string;
	author: string;
	caption: string;
	contents: string[];
	pressLike: boolean;
	likeCount: number;
	createDate: string;
	comments?: {
		id: string;
		author: string;
		body: string;
		likeCount: number;
		pressLike: boolean;
		modificationDate: Date;
	}[];
	commentCount: number;
}

export interface IUploadFeedBody {
	caption: string;
	files?: FileList;
}

export interface IGetFeedParams {
	id: string;
}
