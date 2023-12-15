import { path, allPass, has, propIs, uniq } from 'ramda';
import { TG_CHAT_ID_REGEX, TG_USERNAME_REGEX } from './constants';
import { AnyObject, ChatIdParts } from './types';

const isFieldError = allPass([
	has('message'),
	has('type'),
	propIs(String, 'message'),
	propIs(String, 'type'),
]);

const errorsToStrList = (
	bucket: Array<string>,
	error: unknown,
): Array<string> => {
	if (
		isFieldError(error) &&
		error &&
		typeof error === 'object' &&
		'message' in error
	) {
		return [...bucket, error.message];
	}

	if ('object' === typeof error && error) {
		return Object.values(error).reduce(errorsToStrList, bucket);
	}
	return bucket;
};

export const getErrorStrings = (errors: AnyObject): Array<string> => {
	const strings = Object.values(errors || {}).reduce(errorsToStrList, []);
	return uniq(strings);
};

export const insertScript = (id: string, src: string): void => {
	if (document.getElementById(id)) {
		return;
	}
	const fjs = document.getElementsByTagName('script')[0];
	const js = document.createElement('script');
	js.id = id;
	js.setAttribute('src', src);
	fjs?.parentNode?.insertBefore(js, fjs);
};

/**
 * converts dot and bracket syntax path to ramda path, i.e.
 * 'people[1].address[0].phones[0].code'
 * to
 * ["people", "1", "address", "0", "phones", "0", "code"]
 */
export const strToPath = (str: string): Array<string> =>
	str.split(/[[\].]+/).filter(Boolean);

export const getValueByPath = <T>(strPath: string) =>
	path<T>(strToPath(strPath));

export const prefixName = (name: string, prefix?: string) =>
	prefix ? `${prefix}.${name}` : name;

export const sleep = (milliseconds = 0) =>
	new Promise((resolve) => setTimeout(resolve, milliseconds));

export const isLocalUrl = (): boolean => {
	const LOCAL_DOMAINS = ['localhost', '127.0.0.1'];

	const { hostname } = window.location;

	if (LOCAL_DOMAINS.includes(hostname)) {
		return true;
	}
	const LOCAL_TLDS = ['.test', '.local', '.local.host'];

	return LOCAL_TLDS.some((TLD) => hostname.endsWith(TLD));
};

export const fixChatId = (value: string): string => {
	return (TG_USERNAME_REGEX.test(value) ? `@${value}` : value).trim();
};

export const getChatIdParts = (value: string): ChatIdParts => {
	return {
		chat_id: '',
		thread_id: '',
		note: '',
		...value.match(TG_CHAT_ID_REGEX)?.groups,
	};
};
