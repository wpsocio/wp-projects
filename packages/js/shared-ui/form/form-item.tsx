import { cn } from '@wpsocio/ui-components';
import {
	FormDescription,
	FormItem as FormItemUI,
	FormLabel,
	FormMessage,
} from '@wpsocio/ui-components/wrappers/form.js';

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
	label?: React.ReactNode;
	afterMessage?: React.ReactNode;
	isRequired?: boolean;
	isDisabled?: boolean;
	control?: React.ReactNode;
	description?: React.ReactNode;
	controlWrapperClassName?: string;
}

export function FormItem({
	afterMessage,
	label,
	isRequired,
	isDisabled,
	control,
	description,
	children,
	controlWrapperClassName,
	...props
}: FormItemProps) {
	return (
		<FormItemUI
			{...props}
			className={cn('md:flex md:gap-2 md:py-4', props.className)}
		>
			{label ? (
				<FormLabel
					className={cn('md:mt-2 md:basis-[30%]', {
						'opacity-50 cursor-not-allowed': isDisabled,
					})}
					isRequired={isRequired}
				>
					{label}
				</FormLabel>
			) : null}
			<div className="flex flex-col gap-3 md:flex-1">
				<div
					className={cn(
						'flex w-full gap-4 max-w-lg items-center flex-wrap sm:flex-nowrap',
						controlWrapperClassName,
					)}
				>
					{control || children}
				</div>
				{description ? (
					<FormDescription
						className={cn({
							'opacity-50': isDisabled,
						})}
					>
						{description}
					</FormDescription>
				) : null}
				<FormMessage />
				{afterMessage}
			</div>
		</FormItemUI>
	);
}
