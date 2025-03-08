import fs from 'node:fs';
import path from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';
import { checkAvailablePort } from '../utils/check-available-port.js';

export type DevServerOptions = {
	outDir?: string;
	fileName?: string;
	corsOrigin?: Array<string> | boolean;
};

const TARGET_PLUGINS = ['vite:react-refresh'];

export function devServer(options: DevServerOptions = {}): Plugin {
	let resolvedConfig: ResolvedConfig;

	function getTargetDir() {
		return options.outDir || resolvedConfig.build.outDir;
	}

	function getManifestPath() {
		return path.join(getTargetDir(), options.fileName || 'dev-server.json');
	}

	return {
		apply: 'serve',
		name: 'vwpr:dev-server',
		async config(config) {
			let {
				server: { host = 'localhost', port = 5173, ...serverConfig } = {},
			} = config;

			/**
			 * Need to set an actual host
			 * @see https://github.com/vitejs/vite/issues/5241#issuecomment-950272281
			 */
			if (typeof host === 'boolean') {
				host = '0.0.0.0';
			}

			const hmrProtocol = serverConfig.https ? 'wss' : 'ws';
			const serverProtocol = serverConfig.https ? 'https' : 'http';

			port = await checkAvailablePort({ host, port });

			// This will be used by the PHP helper.
			const origin = `${serverProtocol}://${host}:${port}`;

			return {
				server: {
					...serverConfig,
					host,
					origin,
					port,
					strictPort: true,
					hmr: {
						port,
						host,
						protocol: hmrProtocol,
					},
					cors: {
						origin: options.corsOrigin,
					},
				},
			};
		},
		configResolved(config) {
			resolvedConfig = config;
		},
		buildStart() {
			const { base, plugins, server } = resolvedConfig;

			const data = JSON.stringify({
				base,
				origin: server.origin,
				port: server.port,
				plugins: TARGET_PLUGINS.filter((i) =>
					plugins.some(({ name }) => name === i),
				),
			});

			// Ensure the directory exists
			fs.mkdirSync(getTargetDir(), { recursive: true });

			fs.writeFileSync(getManifestPath(), data, 'utf8');
		},
		buildEnd() {
			fs.rmSync(getManifestPath(), { force: true });
		},
	};
}
