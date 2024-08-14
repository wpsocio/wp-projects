import { cn } from '@wpsocio/ui-components';

export const Code: React.FC<React.HTMLAttributes<HTMLElement>> = ({
	children,
	...rest
}) => {
	return (
		<code
			{...rest}
			className={cn(
				'whitespace-pre-wrap p-2 text-[#c10808] bg-transparent text-left text-sm',
				rest.className,
			)}
		>
			{children}
		</code>
	);
};
