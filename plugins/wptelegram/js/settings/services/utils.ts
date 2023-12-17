import {
	assocPath,
	concat,
	identity,
	ifElse,
	lensPath,
	map,
	objOf,
	over,
	pathOr,
	pipe,
	prop,
	test,
	trim,
} from 'ramda';

import { TG_USERNAME_REGEX } from '@wpsocio/utilities';

import type { DataShape } from './types';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const processData = (predicate: any) => {
	return (data: DataShape): DataShape => {
		// adjust `value` prop in repeatable fields
		const p2tgChannelsPath = ['p2tg', 'channels'];
		const p2tgChannels = pathOr([], p2tgChannelsPath, data).map(predicate);
		let normalizedData = assocPath(p2tgChannelsPath, p2tgChannels, data);

		const p2tgRulesPath = ['p2tg', 'rules'];
		const p2tgRules = pathOr([], p2tgRulesPath, normalizedData).map(predicate);
		normalizedData = assocPath(p2tgRulesPath, p2tgRules, normalizedData);

		const notifyChatsPath = ['notify', 'chat_ids'];
		const notifyChats = pathOr([], notifyChatsPath, normalizedData).map(
			predicate,
		);
		normalizedData = assocPath(notifyChatsPath, notifyChats, normalizedData);

		return normalizedData;
	};
};

/**
 * Adds @ at the beginning of the chat ID if it's a username
 */
export const fixUsername = ifElse(
	test(TG_USERNAME_REGEX),
	concat('@'),
	identity,
);

const channelsLens = lensPath(['p2tg', 'channels']);

const sanitizeChannels = over(channelsLens, map(pipe(trim, fixUsername)));

/**
 * Prepare default values from REST API schema
 */
export const prepDefaultValues = processData(objOf('value'));

/**
 * Normalizes form data for submission as per the REST schema
 */
export const normalizeData = pipe(processData(prop('value')), sanitizeChannels);
