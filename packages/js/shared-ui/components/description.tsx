import { cn } from '@wpsocio/ui/lib/utils';

export const Description: React.FC<
	React.HTMLAttributes<HTMLParagraphElement>
> = ({ children, ...props }) => {
	return (
		<p
			{...props}
			className={cn('mt-[2px] mb-[5px] italic text-[#646970]', props.className)}
		>
			{children}
		</p>
	);
};
