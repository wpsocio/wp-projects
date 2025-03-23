import { cn } from '@wpsocio/ui/lib/utils';

const style: React.CSSProperties = {
	overflowWrap: 'anywhere',
};

export const Code: React.FC<React.HTMLAttributes<HTMLElement>> = ({
	children,
	...rest
}) => {
	return (
		<code
			{...rest}
			style={style}
			className={cn(
				'whitespace-pre-wrap p-2 text-[#c10808] bg-transparent text-left text-sm',
				rest.className,
			)}
		>
			{children}
		</code>
	);
};
