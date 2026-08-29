import { Flex, __experimentalView as View } from '@wordpress/components';
import clsx from 'clsx';
import styles from './styles.module.scss';

export type WpAdminContainerProps = React.ComponentProps<typeof Flex>;

export function WpAdminContainer({
	children,
	className,
	...props
}: WpAdminContainerProps) {
	return (
		<Flex className={clsx(styles.container, className)} {...props}>
			<View className={styles.view}>{children}</View>
		</Flex>
	);
}
