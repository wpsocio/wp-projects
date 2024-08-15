import { cn } from '@wpsocio/ui-components';

export const PluginInfoItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
	props,
) => {
	return (
		<div
			{...props}
			className={cn(
				'p-4 border-b border-gray-200 w-full text-center',
				props.className,
			)}
		/>
	);
};
