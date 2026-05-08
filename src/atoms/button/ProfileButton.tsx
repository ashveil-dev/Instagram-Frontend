import ProfileImageButton from "./ProfileImageButton";
import VerifiedIcon from "@/assets/images/icons/verified.svg";
import ExitIcon from "@/assets/images/icons/exit.svg?react";

interface IProfileButton {
	image: string;
	imageWidth: string;
	imageHeight: string;
	nickName: string;
	fullName: string;
	follower?: string;
	verified?: boolean;
	onRemove?: () => void;
}

function ProfileButton({
	image,
	imageWidth,
	imageHeight,
	nickName,
	fullName,
	follower,
	verified,
	onRemove,
}: IProfileButton) {
	return (
		<div className="py-[8px] px-[24px] flex hover:bg-[rgba(0,0,0,0.05)] cursor-pointer">
			<div className="flex items-center flex-grow ">
				<div className="mr-[12px]">
					<div className={`w-[${imageWidth}] h-[${imageHeight}]`}>
						<ProfileImageButton image={image} />
					</div>
				</div>

				<div className="flex-grow">
					<div className="text-[14px] font-bold flex gap-[4px]">
						{nickName}{" "}
						{verified && (
							<img src={VerifiedIcon} width={12} height={12} />
						)}
					</div>
					<div className="text-[14px] text-[rgb(114,114,114)]">
						<span>{fullName} </span>
						<span> {verified && `• ${follower}`}</span>
					</div>
				</div>
				<div>
					{onRemove && (
						<ExitIcon
							onClick={onRemove}
							className="text-[rgb(115,115,115)]"
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default ProfileButton;
