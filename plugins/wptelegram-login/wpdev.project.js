// @ts-check
/**
 * @type {import("@wpsocio/wpdev").ProjectConfig['getProjectInfo']}
 */
export const getProjectInfo = () => ({
	title: 'WP Telegram Login',
	key: 'wptelegram_login',
	slug: 'wptelegram-login',
	textDomain: 'wptelegram-login',
});

export { getBundleConfig } from '../wpdev.base.project.js';
