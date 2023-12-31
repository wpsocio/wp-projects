import fg, { Options } from 'fast-glob';

export type ToUpdate = {
	files: string | Array<string>;
	ignore?: Array<string>;
};

export function globFiles(toUpdate: ToUpdate, options?: Options) {
	return fg.sync(toUpdate.files, {
		ignore: toUpdate.ignore,
		...options,
	});
}
