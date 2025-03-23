import { AlertCircle, Info, Success, Warning } from '../icons/index.js';
import {
	AlertDescription,
	AlertTitle,
	Alert as AlertUI,
} from '../components/alert.js';

type AlertUIProps = React.ComponentProps<typeof AlertUI>;

export type AlertProps = Omit<AlertUIProps, 'variant' | 'title'> & {
	icon?: React.ReactNode;
	title?: React.ReactNode;
	description?: React.ReactNode;
	type?: 'success' | 'error' | 'warning' | 'info';
	titleClassName?: string;
};

export function Alert({
	title,
	description,
	children,
	type = 'info',
	icon: alertIcon,
	titleClassName,
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
			{title ? (
				<AlertTitle className={titleClassName}>{title}</AlertTitle>
			) : null}
			{content ? <AlertDescription>{content}</AlertDescription> : null}
		</AlertUI>
	);
}
