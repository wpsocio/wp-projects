import { createServer } from 'net';

export type CheckAvailablePortOptions = {
	host?: string;
	port?: number;
};

/**
 * The next available port number.
 */
export async function checkAvailablePort(
	options: CheckAvailablePortOptions = {},
): Promise<number> {
	const server = createServer();

	return new Promise((resolve, reject) => {
		let { host = 'localhost', port = 5173 } = options;

		const handle_error = (error: { code?: string }) => {
			if (error.code === 'EADDRINUSE') {
				server.listen(++port, host);
			} else {
				server.removeListener('error', handle_error);
				reject(error);
			}
		};

		server.on('error', handle_error);

		server.listen(port, host, () => {
			server.removeListener('error', handle_error);
			server.close();
			resolve(port);
		});
	});
}
