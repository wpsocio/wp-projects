import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils.js';

const avatarVariants = cva('rounded-full overflow-hidden', {
	variants: {
		size: {
			xs: 'h-4 w-4',
			sm: 'h-8 w-8',
			md: 'h-12 w-12',
			lg: 'h-16 w-16',
			xl: 'h-20 w-20',
			xxl: 'h-24 w-24',
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

export type AvatarProps = React.ButtonHTMLAttributes<HTMLSpanElement> &
	VariantProps<typeof avatarVariants> & {
		name: string;
		src: string;
	};

export function Avatar({ name, size, src, className, ...props }: AvatarProps) {
	return (
		<span className={cn(avatarVariants({ size, className }))} {...props}>
			<img src={src} alt={name} className="w-full h-full object-cover" />
		</span>
	);
}
