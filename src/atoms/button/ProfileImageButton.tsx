interface IProfileImageButton {
	image: string;
}

function ProfileImageButton({ image }: IProfileImageButton) {
	return (
		<div className="rounded-[50%] w-full h-full overflow-hidden">
			<img src={image} alt="" className="w-full h-full object-cover" />
		</div>
	);
}

export default ProfileImageButton;
