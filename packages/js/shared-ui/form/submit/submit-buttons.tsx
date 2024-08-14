import { cn } from '@wpsocio/ui-components';
import { Separator } from '@wpsocio/ui-components/ui/separator.js';

export const SubmitButtons: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
	props,
) => {
	return (
		<>
			<Separator />
			<div
				role="group"
				{...props}
				className={cn(
					'flex flex-col sm:inline-flex sm:flex-row gap-4 px-4 mt-4',
					props.className,
				)}
			/>
		</>
	);
};
