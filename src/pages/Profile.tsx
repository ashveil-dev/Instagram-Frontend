import { useParams } from "react-router-dom";
import ProfileContainer from "@/containers/profile/Profile";

function ProfilePage() {
	const { nickName } = useParams();
	return <ProfileContainer nickName={nickName} />;
}

export default ProfilePage;
