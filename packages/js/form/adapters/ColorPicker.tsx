import { useCallback } from 'react';
import { Controller, type ControllerProps } from 'react-hook-form';

import { ColorInputPicker, type ColorPickerProps } from '@wpsocio/adapters';

export const ColorPicker: React.FC<ColorPickerProps & { name?: string }> = (
	props,
) => {
	const render = useCallback<ControllerProps['render']>(
		({ field }) => {
			return <ColorInputPicker {...props} {...field} ref={null} />;
		},
		[props],
	);

	return <Controller name={props.name || ''} render={render} />;
};
