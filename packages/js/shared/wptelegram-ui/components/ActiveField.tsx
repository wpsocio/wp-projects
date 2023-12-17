import { FormField } from '@wpsocio/form';
import { prefixName } from '@wpsocio/utilities';

import { getFieldLabel } from '../services';
import type { CommonProps } from './types';

export const ActiveField: React.FC<CommonProps> = ({ prefix }) => {
	return (
		<FormField
			name={prefixName('active', prefix)}
			fieldType="switch"
			label={getFieldLabel('active')}
		/>
	);
};
