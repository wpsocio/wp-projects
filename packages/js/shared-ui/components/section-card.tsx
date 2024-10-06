import { cn } from '@wpsocio/ui-components';

export interface SectionCardProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
	title: React.ReactNode;
	body?: React.ReactNode;
	className?: string;
	headerClassName?: string;
	bodyClassName?: string;
	headingLevel?: `h${1 | 2 | 3 | 4 | 5 | 6}`;
}

export const SectionCard: React.FC<SectionCardProps> = ({
	body,
	children,
	title,
	className,
	headerClassName,
	bodyClassName,
	headingLevel: H = 'h3',
	...rest
}) => {
	return (
		<section
			className={cn(
				'border rounded-t-md border-gray-200 mb-8 overflow-hidden',
				className,
			)}
			{...rest}
		>
			<H className={cn('bg-[#eaeaea] px-4 py-2', headerClassName)}>{title}</H>
			<div className={cn('px-6 py-4', bodyClassName)}>{body || children}</div>
		</section>
	);
};
