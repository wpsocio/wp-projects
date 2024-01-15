import { createId, init } from '@paralleldrive/cuid2';

export type Variant = 'short' | 'medium' | 'long';

export function uniqId(variant?: Variant) {
	if (!variant) {
		return createId();
	}

	let length: number;

	switch (variant) {
		case 'short':
			length = 8;
			break;
		case 'medium':
			length = 16;
			break;
		case 'long':
			length = 32;
			break;
	}

	return init({ length })();
}
