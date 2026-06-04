/**
 * MongoDB 연결 URI
 * - MONGO_URI 전체 문자열 우선
 * - 없으면 Atlas(SRV) 조합: MONGO_USER, MONGO_PASSWORD, MONGO_CLUSTER_HOST, MONGO_DB_NAME
 */
export function getMongoUri(): string {
	const explicit = process.env.MONGO_URI?.trim();
	if (explicit) {
		if (
			explicit.startsWith("mongodb://") &&
			explicit.includes("localhost")
		) {
			return explicit.replace("localhost", "127.0.0.1");
		}
		return explicit;
	}

	const user = process.env.MONGO_USER?.trim() || "ashveil";
	const password = process.env.MONGO_PASSWORD?.trim();
	const host =
		process.env.MONGO_CLUSTER_HOST?.trim() ||
		"cluster0.fira4pz.mongodb.net";
	const db = process.env.MONGO_DB_NAME?.trim() || "instagram";

	if (!password) {
		throw new Error(
			"Set MONGO_URI or MONGO_PASSWORD (Atlas). Example: mongodb+srv://ashveil:<password>@cluster0.fira4pz.mongodb.net/instagram"
		);
	}

	const encodedUser = encodeURIComponent(user);
	const encodedPassword = encodeURIComponent(password);

	return (
		`mongodb+srv://${encodedUser}:${encodedPassword}@${host}/${db}` +
		"?retryWrites=true&w=majority&appName=Cluster0"
	);
}
