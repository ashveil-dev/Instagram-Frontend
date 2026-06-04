import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/utils/hooks/redux";
import {
	fetchMeThunk,
	fetchProfileThunk,
	followUserThunk,
	uploadProfilePhotoThunk,
	clearViewedProfile,
} from "@/slices/profile/slice";
import FeedListContainer from "@/containers/home/FeedList";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { createConversationApi } from "@/slices/user/profileApi";
import errorMessage from "@/utils/data/errors";

interface IProfileContainer {
	nickName?: string;
}

function ProfileContainer({ nickName }: IProfileContainer) {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const me = useAppSelector((state) => state.profile.me);
	const viewed = useAppSelector((state) => state.profile.viewed);
	const photoUploading = useAppSelector(
		(state) => state.profile.photoUploading
	);
	const photoError = useAppSelector((state) => state.profile.photoError);
	const profile = nickName ? viewed : me;
	const isOwnProfile = !nickName || profile?.isMe === true;

	useEffect(() => {
		if (nickName) {
			dispatch(fetchProfileThunk(nickName));
		} else {
			dispatch(fetchMeThunk(null));
		}
		return () => {
			dispatch(clearViewedProfile());
		};
	}, [dispatch, nickName]);

	const followOnClick = useCallback(() => {
		if (profile && !isOwnProfile) {
			dispatch(followUserThunk(profile.id));
		}
	}, [dispatch, profile, isOwnProfile]);

	const messageOnClick = useCallback(async () => {
		if (!profile || isOwnProfile) return;
		const conversation = await createConversationApi(profile.id);
		navigate("/direct");
		void conversation;
	}, [navigate, profile, isOwnProfile]);

	const photoOnSelect = useCallback(
		(file: File) => {
			dispatch(uploadProfilePhotoThunk(file));
		},
		[dispatch]
	);

	if (!profile) {
		return (
			<div className="p-[40px] text-[14px] text-[#737373]">
				프로필을 불러오는 중...
			</div>
		);
	}

	return (
		<div className="w-full max-w-[935px] py-[24px] px-[20px]">
			<ProfileHeader
				profile={profile}
				isOwnProfile={isOwnProfile}
				photoUploading={photoUploading}
				photoError={errorMessage(photoError) || photoError}
				onFollowClick={followOnClick}
				onMessageClick={messageOnClick}
				onPhotoSelect={photoOnSelect}
			/>
			{profile.nickName && (
				<FeedListContainer
					mode="profile"
					nickName={profile.nickName}
					variant="grid"
				/>
			)}
		</div>
	);
}

export default ProfileContainer;
