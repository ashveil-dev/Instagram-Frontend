import fs from "fs";
import https from "https";
import http from "http";

export function downloadFile(url: string, destination: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const client = url.startsWith("https") ? https : http;
		const file = fs.createWriteStream(destination);

		const request = client.get(
			url,
			{ headers: { "User-Agent": "Mozilla/5.0 (compatible; Instagram-Seed/1.0)" } },
			(response) => {
				if (
					response.statusCode &&
					response.statusCode >= 300 &&
					response.statusCode < 400 &&
					response.headers.location
				) {
					file.close();
					fs.unlink(destination, () => {
						downloadFile(response.headers.location!, destination)
							.then(resolve)
							.catch(reject);
					});
					return;
				}

				if (response.statusCode !== 200) {
					reject(
						new Error(
							`Download failed ${response.statusCode}: ${url}`
						)
					);
					return;
				}

				response.pipe(file);
				file.on("finish", () => {
					file.close();
					resolve();
				});
			}
		);

		request.on("error", (error) => {
			fs.unlink(destination, () => reject(error));
		});
	});
}
