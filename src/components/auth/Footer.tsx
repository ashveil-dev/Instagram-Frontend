function Footer() {
	const aTagClassName = "pl-[8px] pr-[8px] pb-[12px] mb-[12px]";
	return (
		<div className="leading-[16px] font-light text-[#737373] text-[12px] mb-[52px] flex flex-col">
			<div>
				<a href="#Meta" className={aTagClassName}>
					Meta
				</a>
				<a href="#소개" className={aTagClassName}>
					소개
				</a>
				<a href="#블로그" className={aTagClassName}>
					블로그
				</a>
				<a href="#채용 정보" className={aTagClassName}>
					채용 정보
				</a>
				<a href="#도움말" className={aTagClassName}>
					도움말
				</a>
				<a href="#API" className={aTagClassName}>
					API
				</a>
				<a href="#개인정보처리방침" className={aTagClassName}>
					개인정보처리방침
				</a>
				<a href="#약관" className={aTagClassName}>
					약관
				</a>
				<a href="#위치" className={aTagClassName}>
					위치
				</a>
				<a href="#Instagram Lite" className={aTagClassName}>
					Instagram Lite
				</a>
				<a href="#Threads" className={aTagClassName}>
					Threads
				</a>
				<a href="#연락처 업로드 & 비 사용자" className={aTagClassName}>
					연락처 업로드 & 비사용자
				</a>
				<a href="Meta Verified" className={aTagClassName}>
					Meta Verified
				</a>
			</div>
			<div className="mt-[12px] mb-[12px] flex justify-center gap-[10px]">
				<select>
					<option>한국어</option>
				</select>
				<span>© 2024 Instagram from Meta</span>
			</div>
		</div>
	);
}

export default Footer;
