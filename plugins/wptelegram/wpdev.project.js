// @ts-check
/**
 * @type {import("@wpsocio/wpdev").ProjectConfig['getProjectInfo']}
 */
export const getProjectInfo = () => ({
	title: 'WP Telegram',
	key: 'wptelegram',
	slug: 'wptelegram',
	textDomain: 'wptelegram',
});

export { getBundleConfig } from '../wpdev.base.project.js';
