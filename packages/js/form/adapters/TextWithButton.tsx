import { forwardRef } from 'react';
import { useWatch } from 'react-hook-form';

import { TextInput } from '@wpsocio/adapters';

import type { DataShape, RenderFieldProps } from '../types';

const addonAfterProps = { px: '0' };

export const TextWithButton = forwardRef<
	HTMLInputElement,
	RenderFieldProps<'text.button', DataShape>
>(({ addonAfter, button: Button, name, ...rest }, ref) => {
	const value = useWatch({ name });

	const newAddonAfter = Button ? <Button value={value} /> : addonAfter;

	return (
		<TextInput
			name={name}
			borderEnd="0"
			borderEndRadius="0"
			addonAfterProps={addonAfterProps}
			{...rest}
			addonAfter={newAddonAfter}
			ref={ref}
		/>
	);
});
