export const BOT_TOKEN_REGEX = /^\d{9,11}:[a-z0-9_-]{35}$/i;

export const TG_USERNAME_REGEX = /^[a-z][a-z0-9_]{3,30}[a-z0-9]$/i;

// match @username or chat ID along with a ":" followed by thread ID for forums, along with a "|" followed by a note
export const TG_CHAT_ID_REGEX =
	/^(?<chat_id>@?[a-z][a-z0-9_]{3,30}[a-z0-9]|-?[1-9][0-9]{6,20})(?::(?<thread_id>[0-9]+))?(?:\s*\|\s*(?<note>.*))?$/i;

export const TG_PRIVATE_CHAT_ID_REGEX =
	/^(?<chat_id>-?[1-9][0-9]{6,20})(?::(?<thread_id>[0-9]+))?(?:\s*\|\s*(?<note>.*))?$/i;

export const FORM_ERROR = 'form/error';

export const isDev =
	!process.env.NODE_ENV || process.env.NODE_ENV === 'development';
