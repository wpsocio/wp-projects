import { forwardRef } from 'react';

export type HiddenProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Hidden = forwardRef<HTMLInputElement, HiddenProps>((props, ref) => {
	return <input {...props} type='hidden' ref={ref} />;
});
