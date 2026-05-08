import Input from "@/atoms/Inputs/AuthInput/AuthInput";

export interface ILoginFormComponent {
	rules: { [key: string]: boolean };
	inputs: { [key: string]: string };
	errorMessage: string | false;
	inputOnChange: (
		key: string
	) => (e: React.ChangeEvent<HTMLInputElement>) => void;
	submitOnClick: (e: React.FormEvent<HTMLFormElement>) => void;
	registerButtonOnClick: () => void;
}

function LoginFormComponent({
	rules,
	inputs: { id, password },
	errorMessage,
	inputOnChange,
	submitOnClick,
	registerButtonOnClick,
}: ILoginFormComponent) {
	return (
		<div className="max-w-[350px] w-full">
			<div className="pt-[10px] pb-[10px] border-[1px] border-[#dbdbdb] mb-[10px]">
				<div className="flex flex-auto justify-center mt-[36px] mb-[12px]">
					<div className="bg-[url('/src/assets/images/8n91YnfPq0s.png')] w-[175px] h-[51px] bg-[0px_-52px]"></div>
				</div>
				<form
					onSubmit={submitOnClick}
					className="mb-[10px] flex flex-col pt-[10px]"
				>
					<Input
						label="전화번호, 사용자 이름 또는 이메일"
						value={id}
						onChange={inputOnChange("id")}
					/>

					<Input
						label="비밀번호"
						value={password}
						useToggleHiding
						onChange={inputOnChange("password")}
					/>

					<div className="flex flex-auto mt-[8px] mb-[8px] ml-[40px] mr-[40px]">
						<button
							type="submit"
							className={
								"bg-[#0095f6] border-none rounded-lg text-white flex items-center justify-center flex-auto pt-[7px] pb-[7px] pl-4 pr-4 text-[14px]  " +
								`${rules.all ? "opacity-100 cursor-pointer" : "opacity-[0.7] pointer-events-none"}`
							}
						>
							로그인
						</button>
					</div>
					<div className="flex flex-row flex-auto mt-[14px] mb-[22px] ml-[40px] mr-[40px]">
						<span className="before:content-[''] before:flex-grow before:border-[1px]  before:border-[#dedede] before:h-[1px] flex justify-between flex-auto items-center gap-4 after:content-[''] after:flex-grow after:border-[1px] after:border-[#dedede] after:h-[1px]">
							또는
						</span>
					</div>
					<div className="flex flex-auto mt-[8px] mb-[8px] ml-[40px] mr-[40px]">
						<button className="flex flex-auto justify-center gap-[8px]">
							<div className="relative top-[3px] w-[16px] h-[16px] bg-[url('/src/assets/images/TJztmXpWTmS.png')] bg-[-414px_-259px]" />
							<span className="text-[#385185] font-bold text-[14px]">
								Facebook으로 로그인
							</span>
						</button>
					</div>
					{errorMessage && (
						<div className="leading-[18px] text-[14px] whitespace-pre-line break-words text-[rgb(237,73,86)] m-[10px_40px] text-center">
							{errorMessage}
						</div>
					)}
					<div className="flex flex-auto mt-[12px]">
						<a
							href="#비밀번호 찾기"
							className="flex justify-center flex-auto"
						>
							<span className="text-[#003757] text-[12px] font-light">
								비밀번호를 잊으셨나요?
							</span>
						</a>
					</div>
				</form>
			</div>
			<div className="border-[1px] border-[#dbdbdb] mb-[10px] pt-[25px] pb-[25px] pl-[15px] pr-[15px] flex justify-center gap-[5px] text-[14px] ">
				<span>계정이 없으신가요?</span>
				<button
					className="text-[#0095f6] font-bold"
					onClick={registerButtonOnClick}
				>
					가입하기
				</button>
			</div>
			<div className="flex flex-col flex-auto items-center mt-[10px] mb-[10px] ml-[20px] mr-[20px]">
				<div>앱을 다운로드하세요.</div>
				<div className="mt-[10px] mb-[10px] flex gap-[8px]">
					<a
						href="https://play.google.com/store/apps/details?id=com.instagram.android&referrer=ig_mid%3DBBF50F65-33CA-48E8-91EB-0393760F89DB%26utm_campaign%3DloginPage%26utm_content%3Dlo%26utm_source%3Dinstagramweb%26utm_medium%3Dbadge"
						target="_blank"
					>
						<img
							src="https://static.cdninstagram.com/rsrc.php/v3/ye/r/UtJtFmFLCiD.png"
							className="h-[40px]"
						/>
					</a>
					<a
						href="ms-windows-store://pdp/?productid=9nblggh5l9xt&referrer=appbadge&source=www.instagram.com&mode=mini&pos=0%2C0%2C1920%2C1040"
						target="_blank"
					>
						<img
							src="https://static.cdninstagram.com/rsrc.php/v3/yw/r/LBxTdceDfgS.png"
							className="h-[40px]"
						/>
					</a>
				</div>
			</div>
		</div>
	);
}

export default LoginFormComponent;
