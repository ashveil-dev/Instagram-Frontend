import ProfileImage from "./360035642_812561723859722_2543718457893992700_n.jpg";
import Section from "./Section";

function Notification() {
	return (
		<div>
			<div className="pt-[16px] pb-[24px] px-[24px] leading-[18px]">
				<span className="font-bold text-[24px]">알림</span>
			</div>

			<Section
				type="thread"
				term="이번 주"
				isFirst
				author="withinsightyou"
				title="🌕 나르시시스트
				알아보는법 5가지"
				content={`1. 과장을 많이 함 
							2. 내 약점을 잘 잡음 
							3. 불리하면 주제를 귀신같이 바꿈 
							4. 자기 부탁을 다 들어...`}
				pastTime="1일"
				profileImage={ProfileImage}
			/>
			<Section
				type="follow"
				term="이번 달"
				author="jye._jye._"
				pastTime="2주"
				profileImage={ProfileImage}
			/>
			<Section
				type="thread"
				term="이전 활동"
				author="mimaroom2.0"
				title="不知道怎麼把蛋黃跟蛋白分開的"
				pastTime="6주"
				profileImage={ProfileImage}
			/>
		</div>
	);
}

export default Notification;
