function getPublicBaseUrl(): string {
	const explicit = process.env.PUBLIC_SERVER_URL?.trim();
	if (explicit) {
		return explicit.replace(/\/$/, "");
	}
	const host = process.env.SERVER_ADDRESS ?? "127.0.0.1";
	const port = process.env.PORT ?? "4000";
	return `http://${host}:${port}`;
}

export function getDefaultProfilePhotoUrl(): string {
	return `${getPublicBaseUrl()}/images/defaultProfileImage.jpg`;
}

export function buildMediaUrl(relativePath: string): string {
	const base = getPublicBaseUrl();
	const filePath = relativePath.startsWith("/")
		? relativePath.slice(1)
		: relativePath;
	return `${base}/${filePath}`;
}

export function photoUrlToLocalPath(photoUrl: string): string | null {
	if (photoUrl.includes("defaultProfileImage")) {
		return null;
	}

	const match = photoUrl.match(/\/images\/([^/?]+)$/);
	if (!match) {
		return null;
	}

	return `files/images/${match[1]}`;
}
