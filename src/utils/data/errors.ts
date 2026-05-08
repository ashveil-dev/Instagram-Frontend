type errorsType = {
	[key: string]: string;
};

const errors: errorsType = {
	"Input are invalid": "입력값이 존재하지 않거나 유효하지 않습니다.",
	"Phone already exists": "휴대폰이 이미 존재합니다.",
	"Email already exists": "이메일이 이미 존재합니다.",
	"Nickname already exists": "닉네임이 이미 존재합니다.",
	"User does not exist" : "해당 아이디가 존재하지 않습니다.",
	"Password is not correct": "비밀번호가 틀렸습니다.",
	"Unable to communicate with the server": "서버에 접속할 수 없습니다.",
	"Database unknown error": "서버에 장애가 발생했습니다.",
};

function errorMessage(error?: string) {
	if (error === undefined) return false;
	if (error !== undefined && !Object.keys(errors).includes(error))
		return "알 수 없는 오류가 발생했습니다.";
	return errors[error];
}

export default errorMessage;
