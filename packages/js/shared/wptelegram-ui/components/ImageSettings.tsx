import { useMemo } from 'react';

import { FeildStack, FeildStackItem } from '@wpsocio/components';
import { __ } from '@wpsocio/i18n';
import { FormField, useWatch } from '@wpsocio/form';
import { prefixName } from '@wpsocio/utilities';

import { getFieldLabel } from '../services';
import { SingleMessage } from './SingleMessage';
import type { CommonProps } from './types';

export const ImageSettings: React.FC<CommonProps> = ({ prefix }) => {
	const isDisabled = !useWatch({
		name: prefixName('send_featured_image', prefix),
	});

	const image_position_options = useMemo(
		() => [
			{
				value: 'before',
				label: __('Before the Text'),
				isDisabled,
			},
			{
				value: 'after',
				label: __('After the Text'),
				isDisabled,
			},
		],
		[isDisabled],
	);
	return (
		<FeildStack>
			<FeildStackItem>
				<FormField
					name={prefixName('send_featured_image', prefix)}
					description={__('Send Featured Image (if exists).')}
					fieldType="switch"
					label={getFieldLabel('send_featured_image')}
					controlClassName="no-flex"
				/>
			</FeildStackItem>
			<FeildStackItem>
				<FormField
					fieldType="radio"
					isDisabled={isDisabled}
					name={prefixName('image_position', prefix)}
					label={getFieldLabel('image_position')}
					options={image_position_options}
					controlClassName="no-flex"
				/>
			</FeildStackItem>
			<FeildStackItem>
				<SingleMessage prefix={prefix} isDisabled={isDisabled} />
			</FeildStackItem>
		</FeildStack>
	);
};
