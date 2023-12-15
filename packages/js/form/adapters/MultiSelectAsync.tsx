import { useCallback } from 'react';
import { Controller, ControllerProps } from 'react-hook-form';

import {
	MultiSelectAsync as MultiSelectAsyncAdapter,
	MultiSelectAsyncProps,
} from '@wpsocio/adapters';

const DEFAULT_VALUE: Array<unknown> = [];

export const MultiSelectAsync: React.FC<MultiSelectAsyncProps> = (props) => {
	const render = useCallback<ControllerProps['render']>(
		({ field }) => {
			return (
				<MultiSelectAsyncAdapter
					{...props}
					{...field}
					value={field.value || DEFAULT_VALUE}
				/>
			);
		},
		[props],
	);

	return (
		<Controller
			name={props.name || ''}
			render={render}
			defaultValue={props.defaultValue}
		/>
	);
};
