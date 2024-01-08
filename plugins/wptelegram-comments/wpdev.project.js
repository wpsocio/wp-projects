// @ts-check
/**
 * @type {import("@wpsocio/wpdev").ProjectConfig['getProjectInfo']}
 */
export const getProjectInfo = () => ({
	title: 'WP Telegram Comments',
	key: 'wptelegram_comments',
	slug: 'wptelegram-comments',
	textDomain: 'wptelegram-comments',
});

export { getBundleConfig } from '../wpdev.base.project.js';
