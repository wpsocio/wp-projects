import { type APIFetchOptions, fetchAPI } from '../api-fetch';
import type { ApiData } from '../types';
import type { ApiParams, TelegramApi, TelegramApiMethod } from './types';

class ApiClient implements TelegramApi {
	private apiData: Partial<ApiData> = {};

	private botToken: string;

	private baseUrl = '';

	private path = '/wptelegram-bot/v1';

	private event?: React.MouseEvent | React.KeyboardEvent;

	deleteWebhook: TelegramApiMethod = undefined as unknown as TelegramApiMethod;
	getChatMembersCount: TelegramApiMethod =
		undefined as unknown as TelegramApiMethod;
	getMe: TelegramApiMethod = undefined as unknown as TelegramApiMethod;
	getWebhookInfo: TelegramApiMethod = undefined as unknown as TelegramApiMethod;
	sendMessage: TelegramApiMethod = undefined as unknown as TelegramApiMethod;
	setWebhook: TelegramApiMethod = undefined as unknown as TelegramApiMethod;
	sendPhoto: TelegramApiMethod = undefined as unknown as TelegramApiMethod;
	sendVideo: TelegramApiMethod = undefined as unknown as TelegramApiMethod;
	sendAudio: TelegramApiMethod = undefined as unknown as TelegramApiMethod;
	sendDocument: TelegramApiMethod = undefined as unknown as TelegramApiMethod;

	constructor(botToken?: string) {
		this.botToken = botToken || '';
	}

	setBotToken = (botToken: string): void => {
		this.botToken = botToken;
	};

	setApiData = (apiData: ApiData): void => {
		this.apiData = apiData;
	};

	setBaseUrl = (baseUrl: string): void => {
		this.baseUrl = baseUrl;
	};

	setEvent = (event: React.MouseEvent | React.KeyboardEvent): void => {
		this.event = (event?.nativeEvent || event) as unknown as React.MouseEvent;
	};

	getOptions = (
		apiMethod: string,
		apiParams: ApiParams,
	): APIFetchOptions<true> => {
		// if testing on playground, use browser
		if (location.hostname === 'playground.wordpress.net') {
			this.apiData.use = 'BROWSER';
		}
		// if holding shift key while testing
		if (this.event?.shiftKey) {
			if (!this.apiData.use || this.apiData.use === 'SERVER') {
				this.apiData.use = 'BROWSER';
			} else if (this.apiData.use === 'BROWSER') {
				this.apiData.use = 'SERVER';
			}
		}
		let options: APIFetchOptions<true> = {};

		if (this.apiData.use === 'BROWSER') {
			options = {
				data: apiParams,
				// use absolute URL
				url: this.buildUrl(apiMethod),
				// override the value set by wp-api-fetch
				credentials: 'omit',
			};
		} else {
			options = {
				data: {
					bot_token: this.botToken,
					api_params: apiParams,
				},
				// use WP REST relative path
				path: `${this.path}/base?api_method=${apiMethod}`,
			};
		}

		return options;
	};

	buildUrl = (apiMethod?: string): string => {
		if (this.apiData.use === 'BROWSER') {
			this.setBaseUrl('https://api.telegram.org');
			return `${this.baseUrl}/bot${this.botToken}/${apiMethod}`;
		}
		return this.baseUrl;
	};

	sendRequest = async <T>(
		apiMethod: string,
		apiParams: ApiParams,
		options?: APIFetchOptions<true>,
	): Promise<T> => {
		if (!this.botToken) {
			throw new Error('Bot token is empty');
		}

		const fetchOptions: APIFetchOptions<true> = {
			...this.getOptions(apiMethod, apiParams),
			...options,
		};

		return await fetchAPI.POST<T>(fetchOptions);
	};
}

// dynamic method to make api calls
const botApi = new window.Proxy(new ApiClient(), {
	get: (client, key) => {
		const prop = key as keyof typeof client;

		if ('undefined' === typeof client[prop]) {
			return async <T>(
				apiParams: ApiParams,
				options?: APIFetchOptions<true>,
			) => {
				return await client.sendRequest<T>(prop as string, apiParams, options);
			};
		}
		if ('function' !== typeof client[prop]) {
			return client[prop];
		}
		return client[prop];
	},
	set: (client, key, value) => {
		const prop = key as keyof typeof client | 'baseUrl';
		// do not allow certain things to be changed
		if (typeof client[prop] === 'function' || prop === 'baseUrl') {
			return false;
		}
		client[prop] = value;
		return true;
	},
});

export default botApi;
