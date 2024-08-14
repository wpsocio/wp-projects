import { cn } from '@wpsocio/ui-components';

export interface SectionCardProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
	title: React.ReactNode;
	body?: React.ReactNode;
	className?: string;
	headerClassName?: string;
	bodyClassName?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
	body,
	children,
	title,
	className,
	headerClassName,
	bodyClassName,
	...rest
}) => {
	return (
		<div
			className={cn(
				'border rounded-t-md border-gray-200 mb-8 overflow-hidden',
				className,
			)}
			{...rest}
		>
			<div className={cn('bg-[#eaeaea] px-4 py-2', headerClassName)}>
				{title}
			</div>
			<div className={cn('px-6 py-4', bodyClassName)}>{body || children}</div>
		</div>
	);
};
