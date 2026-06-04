import { useRef } from "react";
import { resolveMediaUrl } from "@/utils/mediaUrl";
import type { IUserProfile } from "@/utils/types/user";

interface IProfileHeader {
	profile: IUserProfile;
	isOwnProfile: boolean;
	photoUploading: boolean;
	photoError?: string;
	onFollowClick: () => void;
	onMessageClick: () => void;
	onPhotoSelect: (file: File) => void;
}

function ProfileHeader({
	profile,
	isOwnProfile,
	photoUploading,
	photoError,
	onFollowClick,
	onMessageClick,
	onPhotoSelect,
}: IProfileHeader) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const openFilePicker = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			onPhotoSelect(file);
		}
		e.target.value = "";
	};

	return (
		<div className="flex gap-[40px] mb-[44px] items-center">
			<div className="relative w-[150px] h-[150px] flex-shrink-0">
				<div className="w-full h-full rounded-full overflow-hidden bg-[#efefef]">
					<img
						src={resolveMediaUrl(profile.photo)}
						alt={profile.nickName}
						className="w-full h-full object-cover"
					/>
					{photoUploading && (
						<div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
							<span className="text-white text-[12px] font-semibold">
								업로드 중...
							</span>
						</div>
					)}
				</div>
				{isOwnProfile && (
					<>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/png,image/jpeg,image/jpg,image/webp"
							className="hidden"
							onChange={handleFileChange}
						/>
						<button
							type="button"
							onClick={openFilePicker}
							disabled={photoUploading}
							className="absolute bottom-[4px] right-[4px] w-[36px] h-[36px] rounded-full bg-white border border-[#dbdbdb] shadow flex items-center justify-center text-[18px] disabled:opacity-50"
							aria-label="프로필 사진 변경"
						>
							📷
						</button>
					</>
				)}
			</div>
			<div className="flex-grow">
				<div className="flex items-center gap-[20px] mb-[20px]">
					<h1 className="text-[20px] font-light">{profile.nickName}</h1>
					{isOwnProfile ? (
						<button
							type="button"
							onClick={openFilePicker}
							disabled={photoUploading}
							className="px-[16px] py-[7px] bg-[#efefef] rounded-[8px] font-semibold text-[14px] disabled:opacity-50"
						>
							프로필 사진 변경
						</button>
					) : (
						<>
							<button
								type="button"
								onClick={onFollowClick}
								className={
									"px-[16px] py-[7px] rounded-[8px] font-semibold text-[14px] " +
									(profile.isFollowing
										? "bg-[#efefef]"
										: "bg-[#0095f6] text-white")
								}
							>
								{profile.isFollowing ? "팔로잉" : "팔로우"}
							</button>
							<button
								type="button"
								onClick={onMessageClick}
								className="px-[16px] py-[7px] bg-[#efefef] rounded-[8px] font-semibold text-[14px]"
							>
								메시지
							</button>
						</>
					)}
				</div>
				<div className="flex gap-[40px] mb-[20px] text-[16px]">
					<span>
						<strong>{profile.postCount}</strong> 게시물
					</span>
					<span>
						<strong>{profile.follower}</strong> 팔로워
					</span>
					<span>
						<strong>{profile.following}</strong> 팔로우
					</span>
				</div>
				<div className="text-[14px] font-semibold">{profile.fullName}</div>
				{photoError && (
					<p className="mt-[8px] text-[14px] text-[#ed4956]">
						{photoError}
					</p>
				)}
			</div>
		</div>
	);
}

export default ProfileHeader;
