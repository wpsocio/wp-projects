import { FormItem as FormItemUI, FormMessage } from '@wpsocio/ui/wp/form';
import clsx from 'clsx';
import styles from './styles.module.scss';

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
	afterMessage?: React.ReactNode;
	control?: React.ReactNode;
}

export function FormItem({
	afterMessage,
	control,
	children,
	...props
}: FormItemProps) {
	return (
		<FormItemUI {...props} className={clsx(styles.container, props.className)}>
			<div>{control || children}</div>
			<div className={clsx(styles['message-wrapper'])}>
				<FormMessage />
			</div>
			{afterMessage}
		</FormItemUI>
	);
}
