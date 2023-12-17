import { __ } from '@wpsocio/i18n';
import { FormField } from '@wpsocio/form';
import { prefixName } from '@wpsocio/utilities';
import { Link } from '@wpsocio/adapters';

import { getFieldLabel } from '../services';
import type { CommonProps } from './types';

export const ProtectContent: React.FC<CommonProps> = ({ prefix }) => {
	return (
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
		/>
	);
};
