import { FeildStack, FeildStackItem } from '@wpsocio/components';
import { FormField } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { prefixName } from '@wpsocio/utilities';

import { Link } from '@wpsocio/adapters';
import { getFieldLabel } from '../services';
import { ParseModeField } from './ParseModeField';
import type { CommonProps } from './types';

export const MiscMessageSettings: React.FC<CommonProps> = ({ prefix }) => {
	return (
		<FeildStack>
			<FeildStackItem>
				<FormField
					name={prefixName('cats_as_tags', prefix)}
					fieldType="switch"
					label={getFieldLabel('cats_as_tags')}
					description={__('Send categories as hashtags.')}
					controlClassName="no-flex"
				/>
			</FeildStackItem>
			<FeildStackItem>
				<ParseModeField prefix={prefix} controlClassName="no-flex" />
			</FeildStackItem>
			<FeildStackItem>
				<FormField
					after={
						<Link
							color="blue.500"
							href="https://telegram.org/blog/protected-content-delete-by-date-and-more#protected-content-in-groups-and-channels"
							isExternal
							mt="0.3em"
						>
							{__('Learn more')}
						</Link>
					}
					description={__(
						'Protects the contents of sent messages from forwarding and saving.',
					)}
					fieldType="switch"
					label={getFieldLabel('protect_content')}
					name={prefixName('protect_content', prefix)}
					controlClassName="no-flex"
				/>
			</FeildStackItem>
		</FeildStack>
	);
};
