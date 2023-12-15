import { useCallback } from 'react';
import { Controller, ControllerProps } from 'react-hook-form';

import { Radio as RadioAdapter, RadioProps } from '@wpsocio/adapters';

export const Radio: React.FC<RadioProps> = (props) => {
	const render = useCallback<ControllerProps['render']>(
		({ field }) => {
			return <RadioAdapter {...props} {...field} />;
		},
		[props],
	);

	return <Controller name={props.name || ''} render={render} />;
};
