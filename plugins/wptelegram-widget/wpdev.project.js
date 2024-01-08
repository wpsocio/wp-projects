// @ts-check
/**
 * @type {import("@wpsocio/wpdev").ProjectConfig['getProjectInfo']}
 */
export const getProjectInfo = () => ({
	title: 'WP Telegram Widget',
	key: 'wptelegram_widget',
	slug: 'wptelegram-widget',
	textDomain: 'wptelegram-widget',
});

export { getBundleConfig } from '../wpdev.base.project.js';
