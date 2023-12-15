// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export interface AnyObject<T = any> {
	[key: string]: T;
}

export type ParseMode = 'HTML' | 'none';

export type UpdateMethod = 'webhook' | 'long_polling' | 'none';

export type BotInstance = {
	bot_token: string;
	bot_username: string;
	update_method: UpdateMethod;
};

export type KeyboardButton = {
	id?: string;
	label?: string;
	value?: string;
	url?: string;
};

export type ChatIdParts = {
	chat_id: string;
	thread_id?: string;
	note?: string;
};
