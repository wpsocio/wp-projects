import { __ } from '@wpsocio/i18n';
import { getChatIdParts } from '@wpsocio/utilities/misc';
import { getErrorMessage } from '../apiFetch';
import botApi from './TelegramAPI';
import type {
	SendTextMessage,
	TelegramApiUtil,
	TestBotToken,
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
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
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
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
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
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		console.log('ERROR', error);

		setStatus('ERROR', () => getErrorMessage(error));
	} finally {
		setInProgress?.(false);
	}
};

export const checkMemberCount: TelegramApiUtil = async (args) => {
	init(args);

	const { setInProgress, setResult, setResultType } = args;

	const { chat_id } = getChatIdParts(args.chat_id || '');

	try {
		const { result } = await botApi.getChatMembersCount({ chat_id });

		setResultType?.('SUCCESS');
		setResult?.(result);
	} catch (error) {
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		console.log('ERROR', error);

		setResultType?.('ERROR');
		setResult?.(getErrorMessage(error));
	} finally {
		setInProgress?.(false);
	}
};

export const sendTestMessage: SendTextMessage = async (args, event) => {
	const text =
		args.text ||
		window.prompt(
			__(
				'A message will be sent to the Channel/Group/Chat. You can modify the text below',
			),
			__('This is a test message'),
		);

	if (!text) {
		return;
	}

	return await sendTextMessage({ ...args, text }, event);
};

export const sendTextMessage: SendTextMessage = async (args, event) => {
	init(args, event);

	const { setInProgress, setResult, setResultType, text } = args;

	const { chat_id, thread_id: message_thread_id } = getChatIdParts(
		args.chat_id || '',
	);

	try {
		await botApi.sendMessage({ chat_id, text, message_thread_id });
		setResultType?.('SUCCESS');
		setResult?.(__('Success'));
	} catch (error) {
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		console.log('ERROR', error);

		setResultType?.('ERROR');
		setResult?.(getErrorMessage(error));
	} finally {
		setInProgress?.(false);
	}
};

export const testBotToken: TestBotToken = async (args, event) => {
	init(args, event);

	const { bot_token, setInProgress, setResult, setResultType, onComplete } =
		args;

	try {
		const { result } = await botApi.getMe({});
		setResultType?.('SUCCESS');

		onComplete?.(bot_token, result);

		if (
			result &&
			typeof result === 'object' &&
			'first_name' in result &&
			'username' in result
		) {
			setResult?.(`${result.first_name} (@${result.username})`);
		}
	} catch (error) {
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		console.log('ERROR', error);

		setResultType?.('ERROR');
		setResult?.(getErrorMessage(error));

		onComplete?.(bot_token, {});
	} finally {
		setInProgress?.(false);
	}
};

const init: TelegramApiUtil = async (args, event) => {
	if (event) {
		botApi.setEvent(event);
	}

	const { bot_token, setInProgress } = args;
	setInProgress?.(true);

	botApi.setBotToken(bot_token);
};
