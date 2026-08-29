import { __experimentalView as View } from '@wordpress/components';
import clsx from 'clsx';
import styles from './styles.module.scss';

export type FieldsetAsLabelProps = React.HTMLAttributes<HTMLFieldSetElement> & {
	label: React.ReactNode;
	labelProps?: React.HTMLAttributes<HTMLLegendElement>;
	description?: React.ReactNode;
};

export function FieldsetAsLabel({
	label,
	children,
	labelProps,
	description,
	...props
}: FieldsetAsLabelProps) {
	return (
		<fieldset {...props}>
			<View
				{...labelProps}
				as="legend"
				className={clsx('components-base-control__label', styles.label)}
			>
				{label}
			</View>
			<View>{children}</View>
			{description ? (
				<View
					className={clsx('components-base-control__help', styles.description)}
				>
					{description}
				</View>
			) : null}
		</fieldset>
	);
}
