export const buildShortCodeFromAtts = (
	attributes: Record<string, any>,
	allowedAtts: Array<string>,
	shrotcode: string,
): string => {
	const attsKV = allowedAtts
		.filter((att) => attributes?.[att])
		.map((att) => `${att}="${attributes[att]}"`);

	const atts = attsKV.length ? ' ' + attsKV.join(' ') : '';

	return `[${shrotcode} ${atts}]`;
};
