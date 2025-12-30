import { cn } from '@wpsocio/ui/lib/utils';

export const SubmitButtons: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
	props,
) => {
	return (
		// biome-ignore lint/a11y/useSemanticElements: role="group" is fine
		<div
			role="group"
			{...props}
			className={cn(
				'flex flex-col sm:inline-flex sm:flex-row gap-4 px-4 mt-4',
				props.className,
			)}
		/>
	);
};
