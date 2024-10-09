import * as React from 'react';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
	useFormField,
} from '../ui/form.js';

import { cn } from '../lib/utils.js';
import { Label } from './label.js';

const FormLabel = React.forwardRef<
	React.ElementRef<typeof Label>,
	React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
	const { error, formItemId } = useFormField();

	return (
		<Label
			ref={ref}
			className={cn(error && 'text-destructive', className)}
			htmlFor={formItemId}
			{...props}
		/>
	);
});
FormLabel.displayName = 'FormLabel';

export {
	useFormField,
	Form,
	FormItem,
	FormControl,
	FormDescription,
	FormMessage,
	FormField,
	FormLabel,
};
