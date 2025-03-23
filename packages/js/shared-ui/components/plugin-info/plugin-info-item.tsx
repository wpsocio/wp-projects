import { cn } from '@wpsocio/ui/lib/utils';

export const PluginInfoItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
	props,
) => {
	return (
		<div
			{...props}
			className={cn('p-4 border-b border-gray-200 w-full', props.className)}
		/>
	);
};
