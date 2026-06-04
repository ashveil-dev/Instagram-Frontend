import { createInitialDatabase } from "./seedData";
import type { MockDatabase } from "./types";

const STORAGE_KEY = "instagram-mock-db-v1";

let memory: MockDatabase | null = null;

export function loadDatabase(): MockDatabase {
	if (memory) {
		return memory;
	}

	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			memory = JSON.parse(raw) as MockDatabase;
			return memory;
		}
	} catch {
		/* reset corrupt data */
	}

	memory = createInitialDatabase();
	saveDatabase(memory);
	return memory;
}

export function saveDatabase(db: MockDatabase) {
	memory = db;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
	} catch {
		/* quota exceeded — keep in-memory only */
	}
}

export function resetDatabase() {
	memory = createInitialDatabase();
	saveDatabase(memory);
}
