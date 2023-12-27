import type { ViteWpReactOptions } from '@wpsocio/vite-wp-react';
import { ReactMakePotOptions } from '@wpsocio/vite-wp-react/plugins';

export type CreateViteConfigOptions = ViteWpReactOptions & {
	makePot?: ReactMakePotOptions;
};
