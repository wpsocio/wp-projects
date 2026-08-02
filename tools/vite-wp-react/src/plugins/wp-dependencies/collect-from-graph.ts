import type { Rollup } from 'vite';
import { toPosixRelative } from '../../utils/paths.js';
import { externalShims } from '../externals/index.js';

/**
 * Collects externalized dependencies per entry by walking the module graph.
 */
export function collectFromGraph(
	context: Rollup.PluginContext,
	root: string,
	normalize: (name: string) => string,
) {
	const dependencies: Record<string, Array<string>> = {};

	for (const entryId of context.getModuleIds()) {
		if (!context.getModuleInfo(entryId)?.isEntry) {
			continue;
		}

		const deps = new Set<string>();
		const visited = new Set<string>();
		const queue = [entryId];

		let current = queue.pop();

		while (current) {
			if (!visited.has(current)) {
				visited.add(current);

				const source = externalShims.get(current);

				if (source) {
					deps.add(normalize(source));
				} else {
					const info = context.getModuleInfo(current);

					queue.push(
						...(info?.importedIds ?? []),
						...(info?.dynamicallyImportedIds ?? []),
					);
				}
			}

			current = queue.pop();
		}

		dependencies[toPosixRelative(root, entryId)] = [...deps];
	}

	return dependencies;
}
