import { __experimentalView as View } from '@wordpress/components';
import clsx from 'clsx';
import styles from './styles.module.scss';

export type FieldsetAsLabelProps = {
	label: React.ReactNode;
	children?: React.ReactNode;
};

export function FieldsetAsLabel({ label, children }: FieldsetAsLabelProps) {
	return (
		<fieldset>
			<View
				as="legend"
				className={clsx('components-base-control__label', styles.label)}
			>
				{label}
			</View>
			<View>{children}</View>
		</fieldset>
	);
}
