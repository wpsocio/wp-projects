import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../components/dialog.js';

export type ModalProps = React.ComponentProps<typeof Dialog> & {
	trigger?: React.ReactNode;
	title: React.ReactNode;
	description?: React.ReactNode;
	content?: React.ReactNode;
	contentClassName?: string;
};

export function Modal({
	trigger,
	content,
	children,
	title,
	description,
	contentClassName,
	...props
}: ModalProps) {
	return (
		<Dialog {...props}>
			{trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
			<DialogContent className={contentClassName}>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description ? (
						<DialogDescription>{description}</DialogDescription>
					) : null}
					{content || children}
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
