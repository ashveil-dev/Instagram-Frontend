const PREFIX = "mock.";

export type MockTokenPayload = {
	id: string;
	nickName: string;
	fullName: string;
	photo: string;
	exp: number;
};

export function createMockTokens(payload: Omit<MockTokenPayload, "exp">) {
	const full: MockTokenPayload = {
		...payload,
		exp: Date.now() + 60 * 60 * 1000,
	};
	const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(full))));
	const token = `${PREFIX}${encoded}`;
	return { accessToken: token, refreshToken: `${token}.refresh` };
}

export function parseMockAccessToken(
	token: string | null | undefined
): MockTokenPayload | null {
	if (!token || !token.startsWith(PREFIX)) {
		return null;
	}
	try {
		const raw = token.startsWith(PREFIX) ? token.slice(PREFIX.length) : token;
		const clean = raw.replace(/\.refresh$/, "");
		const json = decodeURIComponent(
			escape(atob(clean))
		) as unknown as MockTokenPayload;
		if (!json.exp || json.exp < Date.now()) {
			return null;
		}
		return json;
	} catch {
		return null;
	}
}

export function getUserIdFromAuth(
	authHeader?: string
): string | null {
	if (!authHeader?.includes("Bearer ")) {
		return null;
	}
	const token = authHeader.split("Bearer ")[1]?.trim();
	const payload = parseMockAccessToken(token);
	return payload?.id ?? null;
}
