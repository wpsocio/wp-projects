import { AlertCircle, Info, Success, Warning } from '../icons/index.js';
import { AlertDescription, AlertTitle, Alert as AlertUI } from '../ui/alert.js';

type AlertUIProps = React.ComponentProps<typeof AlertUI>;

export type AlertProps = Omit<AlertUIProps, 'variant'> & {
	icon?: React.ReactNode;
	title?: string;
	description?: string;
	type: 'success' | 'error' | 'warning' | 'info';
};

export function Alert({
	title,
	description,
	children,
	type,
	icon: alertIcon,
	...props
}: AlertProps) {
	let icon = alertIcon;

	if (undefined === icon) {
		switch (type) {
			case 'success':
				icon = <Success size="16" />;
				break;
			case 'error':
				icon = <AlertCircle size="16" />;
				break;
			case 'warning':
				icon = <Warning size="16" />;
				break;
			case 'info':
				icon = <Info size="16" />;
				break;
		}
	}

	const content = description || children;

	return (
		<AlertUI {...props} variant={type === 'error' ? 'destructive' : 'default'}>
			{icon}
			{title ? <AlertTitle>{title}</AlertTitle> : null}
			{content ? <AlertDescription>{content}</AlertDescription> : null}
		</AlertUI>
	);
}
