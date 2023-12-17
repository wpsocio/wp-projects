import type { SimpleOptionsType } from '@wpsocio/adapters';
import type { ArrayField, RepeatableValue } from '@wpsocio/form';

export type ProxyType =
	| 'CURLPROXY_HTTP'
	| 'CURLPROXY_SOCKS4'
	| 'CURLPROXY_SOCKS4A'
	| 'CURLPROXY_SOCKS5'
	| 'CURLPROXY_SOCKS5_HOSTNAME';

export type Rule = Partial<
	ArrayField<{
		param: string;
		custom_param?: string;
		operator: 'in' | 'not_in';
		values: SimpleOptionsType;
	}>
>;

export type RuleGroup = Partial<ArrayField<RepeatableValue<Array<Rule>>>>;

export type Rules = Array<RuleGroup>;

export type ChatIds = Array<Partial<ArrayField<RepeatableValue<string>>>>;
