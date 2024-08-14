import {
	type SelectProps,
	Select as SelectUI,
} from '@wpsocio/ui-components/wrappers/select.js';
import { forwardRef } from 'react';
import { ROOT_ID } from '../constants.js';

/**
 * Since we scope tailwind CSS to the plugin settings container, we need to
 * pass the container element to the select component to render the dropdown
 * with proper styles.
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(
	(props, ref) => {
		return (
			<SelectUI
				{...props}
				ref={ref}
				portalContainer={document.getElementById(ROOT_ID)}
			/>
		);
	},
);
