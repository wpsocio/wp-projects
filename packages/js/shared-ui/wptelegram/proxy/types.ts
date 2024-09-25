export interface ProxyFields {
	active?: boolean;
	proxy_method?: 'cf_worker' | 'google_script' | 'php_proxy';
	cf_worker_url?: string;
	google_script_url?: string;
	proxy_host?: string;
	proxy_port?: number;
	proxy_type?:
		| 'CURLPROXY_HTTP'
		| 'CURLPROXY_SOCKS4'
		| 'CURLPROXY_SOCKS4A'
		| 'CURLPROXY_SOCKS5'
		| 'CURLPROXY_SOCKS5_HOSTNAME';
	proxy_username?: string;
	proxy_password?: string;
}
