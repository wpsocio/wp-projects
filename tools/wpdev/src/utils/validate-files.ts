import fs from 'node:fs';
import path from 'node:path';
import type { ValidateFilesInput } from './schema.js';

export async function validateFiles(
	cwd: string,
	toValidate: ValidateFilesInput,
) {
	for (const { paths, rules } of toValidate) {
		for (const filePath of paths) {
			for (const { value, message } of rules) {
				let errorMessage = '';

				switch (value) {
					case 'EXISTS':
					case 'NOT_EXISTS': {
						const fullPath = path.join(cwd, filePath);
						const exists = fs.existsSync(fullPath);

						if (value === 'EXISTS' && !exists) {
							errorMessage =
								message || 'File "{path}" should exist but it does not.';
						} else if (value === 'NOT_EXISTS' && exists) {
							errorMessage = message || 'File "{path}" should not exist.';
						}
						break;
					}
				}

				if (errorMessage) {
					return errorMessage.replace('{path}', filePath);
				}
			}
		}
	}
}
