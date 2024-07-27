import { useMemo } from 'react';

import {
	Box,
	Divider,
	FormControl,
	Link,
	type SimpleOptionProps,
	Text,
} from '@wpsocio/adapters';
import { Code, Description } from '@wpsocio/components';
import { FormField } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { prefixName } from '@wpsocio/utilities';

import { getFieldLabel } from '../services';
import type { CommonProps } from './types';

export interface AdvancedSettingsProps extends CommonProps {
	log_options: Array<SimpleOptionProps & { viewLink: string }>;
	debug_info: string;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
	debug_info,
	log_options,
	prefix,
}) => {
	const logOptions = useMemo(() => {
		return log_options.map(({ label, viewLink, ...rest }) => ({
			...rest,
			label: (
				<>
					{label}&ensp;[
					<Link href={viewLink} isExternal>
						{__('View log')}
					</Link>
					]
				</>
			),
		}));
	}, [log_options]);

	return (
		<>
			<Description>
				{__(
					'Settings in this section should not be changed unless recommended by WP Telegram Support.',
				)}
			</Description>
			<FormField
				name={prefixName('send_files_by_url', prefix)}
				fieldType="switch"
				label={getFieldLabel('send_files_by_url')}
				description={__(
					'Turn off to upload the files/images instead of passing the url.',
				)}
			/>
			<Divider />
			<FormField
				name={prefixName('enable_logs', prefix)}
				fieldType="multicheck"
				label={getFieldLabel('enable_logs')}
				options={logOptions}
			/>
			<Divider />
			<FormControl className="form-control">
				<Text as="span" className="form-control__label" fontWeight="500">
					{getFieldLabel('debug_info')}
				</Text>
				<Box className="form-control__input">
					<Code>{debug_info}</Code>
				</Box>
			</FormControl>
			<Divider />
			<FormField
				name={prefixName('clean_uninstall', prefix)}
				fieldType="switch"
				label={getFieldLabel('clean_uninstall')}
			/>
		</>
	);
};
