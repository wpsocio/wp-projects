import { forwardRef, useCallback, useEffect, useState } from 'react';
import { Switch as SwitchUI } from '../ui/switch.js';

export type SwitchProps = React.ComponentProps<typeof SwitchUI> & {
	offValue?: React.InputHTMLAttributes<HTMLInputElement>['value'];
};

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
	({ children, offValue, onCheckedChange, ...props }, ref) => {
		const [isChecked, setIsChecked] = useState(
			props.checked ?? props.defaultChecked ?? false,
		);

		const onChange = useCallback(
			(checked: boolean) => {
				setIsChecked(checked);
				onCheckedChange?.(checked);
			},
			[onCheckedChange],
		);

		useEffect(() => {
			setIsChecked((prevVal) => props.checked ?? prevVal);
		}, [props.checked]);

		return (
			<>
				{undefined !== offValue && props.name && !isChecked ? (
					<input type="hidden" name={props.name} value={offValue} />
				) : null}
				<SwitchUI ref={ref} value={1} {...props} onCheckedChange={onChange} />
			</>
		);
	},
);

Switch.displayName = 'Switch';
