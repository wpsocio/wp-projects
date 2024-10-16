import type { APIFetchOptions, BaseApiUtilArgs } from '../api-fetch';

export type ApiParams = Partial<Record<'string', unknown>>;

export type TelegramApiMethod<P = unknown> = (
	apiParams?: P,
	fetchOptions?: APIFetchOptions,
) => Promise<{ result: unknown; ok?: boolean }>;

export type WebhookStatus = 'SET' | 'NOT_SET' | 'ERROR';

export interface TelegramApi {
	deleteWebhook?: TelegramApiMethod;
	getChatMembersCount?: TelegramApiMethod;
	getMe?: TelegramApiMethod;
	getWebhookInfo?: TelegramApiMethod;
	sendMessage?: TelegramApiMethod<SendTextMessageArgs>;
	sendPhoto?: TelegramApiMethod;
	sendVideo?: TelegramApiMethod;
	sendAudio?: TelegramApiMethod;
	setWebhook?: TelegramApiMethod;
	sendDocument?: TelegramApiMethod;
}

export interface TelegramApiUtilBaseArgs extends BaseApiUtilArgs {
	bot_token: string;
	chat_id?: string;
}

export type TelegramApiUtil<
	A extends TelegramApiUtilBaseArgs = TelegramApiUtilBaseArgs,
	T = unknown,
> = (args: A, event?: React.MouseEvent | React.KeyboardEvent) => Promise<T>;

export interface TestBotTokenArgs extends TelegramApiUtilBaseArgs {
	onComplete?: (bot_token: string, result: unknown) => void;
}

export interface SendTextMessageArgs extends TelegramApiUtilBaseArgs {
	text: string;
	parse_mode?: string;
}

export interface WebhookUtilArgs extends TelegramApiUtilBaseArgs {
	setStatus: (status: WebhookStatus, getError?: () => unknown) => void;
	url?: string;
	allowed_updates?: Array<string> | string;
}

export type WebhookUtil = TelegramApiUtil<WebhookUtilArgs>;
