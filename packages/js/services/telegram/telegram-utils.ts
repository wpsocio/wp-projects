import { __ } from '@wpsocio/i18n';
import { getChatIdParts } from '@wpsocio/utilities/misc';
import { type ResultType, getErrorMessage } from '../api-fetch';
import botApi from './telegram-api';
import type {
	SendTextMessageArgs,
	TelegramApiUtilBaseArgs,
	WebhookUtil,
} from './types';

export const setWebhook: WebhookUtil = async (args, event) => {
	init(args, event);

	const {
		setInProgress,
		setStatus,
		setResult,
		setResultType,
		url,
		allowed_updates,
	} = args;

	const params = { url, allowed_updates };

	try {
		const data = await botApi.setWebhook(params);
		if (data?.ok) {
			setStatus('SET');
			setResultType?.('SUCCESS');
			setResult?.('');
		} else {
			setStatus('ERROR');
			setResultType?.('ERROR');
			setResult?.(getErrorMessage(data));
		}
	} catch (error) {
		console.log('ERROR', error);

		setStatus('ERROR');
		setResultType?.('ERROR');

		setResult?.(getErrorMessage(error));
	} finally {
		setInProgress?.(false);
	}
};

export const deleteWebhook: WebhookUtil = async (args, event) => {
	init(args, event);

	const { setInProgress, setStatus, setResult, setResultType } = args;

	try {
		await botApi.deleteWebhook({});
		setStatus('NOT_SET');
		setResultType?.('SUCCESS');
		setResult?.('');
	} catch (error) {
		console.log('ERROR', error);

		setStatus('ERROR');

		setResultType?.('ERROR');

		setResult?.(getErrorMessage(error));
	} finally {
		setInProgress?.(false);
	}
};

export const checkWebhookInfo: WebhookUtil = async (args, event) => {
	init(args, event);

	const { setInProgress, setStatus, url } = args;

	try {
		const { result } = await botApi.getWebhookInfo({});
		if (
			result &&
			typeof result === 'object' &&
			'url' in result &&
			url === result.url
		) {
			setStatus('SET');
		} else {
			setStatus('NOT_SET');
		}
	} catch (error) {
		console.log('ERROR', error);

		setStatus('ERROR', () => getErrorMessage(error));
	} finally {
		setInProgress?.(false);
	}
};

export async function checkMemberCount(
	args: TelegramApiUtilBaseArgs,
): Promise<[resultType: ResultType, result: string]> {
	init(args);

	const { chat_id } = getChatIdParts(args.chat_id || '');

	try {
		const { result } = await botApi.getChatMembersCount({ chat_id });

		return ['SUCCESS', Number(result).toString()];
	} catch (error) {
		console.log('ERROR', error);

		return ['ERROR', getErrorMessage(error)];
	}
}

export const sendTestMessage = async (
	args: SendTextMessageArgs,
	event?: React.MouseEvent | React.KeyboardEvent,
): Promise<[resultType: ResultType, result: string]> => {
	const text =
		args.text ||
		window.prompt(
			__(
				'A message will be sent to the Channel/Group/Chat. You can modify the text below',
			),
			__('This is a test message'),
		);

	if (!text) {
		return ['ERROR', __('Message is empty')];
	}

	return await sendTextMessage({ ...args, text }, event);
};

export async function sendTextMessage(
	args: SendTextMessageArgs,
	event?: React.MouseEvent | React.KeyboardEvent,
): Promise<[resultType: ResultType, result: string]> {
	init(args, event);

	const { chat_id, thread_id: message_thread_id } = getChatIdParts(
		args.chat_id || '',
	);

	try {
		await botApi.sendMessage({ chat_id, text: args.text, message_thread_id });

		return ['SUCCESS', __('Success')];
	} catch (error) {
		console.log('ERROR', error);

		return ['ERROR', getErrorMessage(error)];
	}
}

export async function testBotToken(
	args: TelegramApiUtilBaseArgs,
	event?: React.MouseEvent | React.KeyboardEvent,
): Promise<[resultType: ResultType, result: unknown]> {
	init(args, event);

	try {
		const { result } = await botApi.getMe({});

		return ['SUCCESS', result];
	} catch (error) {
		console.log('ERROR', error);

		return ['ERROR', getErrorMessage(error)];
	}
}

async function init(
	args: TelegramApiUtilBaseArgs,
	event?: React.MouseEvent | React.KeyboardEvent,
) {
	if (event) {
		botApi.setEvent(event);
	}

	const { bot_token, setInProgress } = args;
	setInProgress?.(true);

	botApi.setBotToken(bot_token);
}
