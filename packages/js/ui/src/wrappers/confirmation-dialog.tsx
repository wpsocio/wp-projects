import { cn } from '../lib/utils.js';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '../components/alert-dialog.js';
import { buttonVariants } from '../components/button.js';
import type { Button } from './button.js';

export type ConfirmationDialogProps = React.ComponentProps<
	typeof AlertDialog
> & {
	title: string;
	description?: React.ReactNode;
	children?: React.ReactNode;
	trigger: React.ReactNode;
	actionText: string;
	actionVariant?: React.ComponentProps<typeof Button>['variant'];
	cancelText?: string;
	onAction?: VoidFunction;
};

export function ConfirmationDialog({
	actionText,
	actionVariant,
	cancelText = 'Cancel',
	children,
	description,
	onAction,
	title,
	trigger,
}: ConfirmationDialogProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>
						{description || children}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{cancelText}</AlertDialogCancel>
					<AlertDialogAction
						onClick={onAction}
						className={cn(buttonVariants({ variant: actionVariant }))}
					>
						{actionText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
