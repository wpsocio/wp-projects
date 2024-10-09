import type { ArrayField, RepeatableValue } from '@wpsocio/form/types.js';

export interface CommonProps {
	prefix?: string;
}

export type ChatIds = Array<Partial<ArrayField<RepeatableValue<string>>>>;
