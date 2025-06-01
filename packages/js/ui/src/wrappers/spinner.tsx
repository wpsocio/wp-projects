import { Loader2 } from 'lucide-react';

import { cn } from '../lib/utils.js';

export type SpinnerProps = React.ComponentProps<typeof Loader2>;

export function Spinner({ className, ...props }: SpinnerProps) {
	return (
		<Loader2 className={cn('size-4 animate-spin', className)} {...props} />
	);
}
