import { useCallback } from 'react';
import { Controller, type ControllerProps } from 'react-hook-form';

import {
	MultiCheck as MultiCheckAdapter,
	type MultiCheckProps,
} from '@wpsocio/adapters';

export const MultiCheck: React.FC<MultiCheckProps> = (props) => {
	const render = useCallback<ControllerProps['render']>(
		({ field }) => {
			return <MultiCheckAdapter {...props} {...field} ref={null} />;
		},
		[props],
	);
	return <Controller name={props.name || ''} render={render} />;
};
