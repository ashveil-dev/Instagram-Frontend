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
