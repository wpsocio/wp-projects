import { createServer } from 'node:net';

/**
 * The next available port number, starting at the given one.
 */
export function findAvailablePort(host: string, port: number): Promise<number> {
	const server = createServer();

	return new Promise((resolve, reject) => {
		let candidate = port;

		const onError = (error: { code?: string }) => {
			if (error.code === 'EADDRINUSE') {
				server.listen(++candidate, host);
			} else {
				server.removeListener('error', onError);
				reject(error);
			}
		};

		server.on('error', onError);

		server.listen(candidate, host, () => {
			server.removeListener('error', onError);
			server.close();
			resolve(candidate);
		});
	});
}
