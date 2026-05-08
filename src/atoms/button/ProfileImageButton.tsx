interface IProfileImageButton {
	image: string;
}

function ProfileImageButton({ image }: IProfileImageButton) {
	return (
		<div className="rounded-[50%] w-full h-full overflow-hidden">
			<img src={image} object-fit="cover" />
		</div>
	);
}

export default ProfileImageButton;
