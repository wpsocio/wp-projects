import { __, sprintf } from '@wpsocio/i18n';
import { cn } from '@wpsocio/ui/lib/utils';
import { ArrowRight, Copy, Edit, Trash } from '@wpsocio/ui/icons';
import { Button, type ButtonProps } from '@wpsocio/ui/wrappers/button';
import { ConfirmationDialog } from '@wpsocio/ui/wrappers/confirmation-dialog';
import { IconButton } from '@wpsocio/ui/wrappers/icon-button';
import { Popover } from '@wpsocio/ui/wrappers/popover';

type MessageButtonProps = Omit<ButtonProps, 'value'> & {
	value?: string;
	label: string;
	isUrlButton?: boolean;
	onEdit?: VoidFunction;
	onCopy?: VoidFunction;
	onDelete?: VoidFunction;
	actions?: Array<'edit' | 'copy' | 'delete'>;
	confirmDeletion?: boolean;
	deletionWarning?: React.ReactNode;
	description?: React.ReactNode;
};

export const MessageButton: React.FC<MessageButtonProps> = ({
	label,
	value,
	isUrlButton = true,
	onEdit,
	onCopy,
	onDelete,
	actions = ['edit', 'copy', 'delete'],
	className,
	confirmDeletion,
	deletionWarning,
	description,
	...rest
}) => {
	const title = [value, label].filter(Boolean).join(' | ');

	const button = (
		<Button
			title={title}
			className={cn(
				'px-4 font-normal relative bg-foreground/20 text-foreground hover:bg-foreground/10 focus:bg-foreground/10 active:bg-foreground/20',
				className,
			)}
			size="sm"
			{...rest}
		>
			{label}
			{isUrlButton && (
				<span role="presentation">
					<ArrowRight
						size={14}
						className="absolute top-0.5 end-0.5 -rotate-45 xopacity-50"
					/>
				</span>
			)}
		</Button>
	);

	if (!actions.length) {
		return button;
	}

	return (
		<Popover trigger={button} contentClassName="p-0 max-w-max">
			{description}
			<div className="flex gap-2">
				{actions.includes('edit') && (
					<IconButton
						variant="ghost"
						onClick={onEdit}
						icon={<Edit />}
						aria-label={__('Edit')}
					/>
				)}
				{actions.includes('copy') && (
					<IconButton
						variant="ghost"
						onClick={onCopy}
						icon={<Copy />}
						aria-label={__('Copy')}
					/>
				)}
				{actions.includes('delete') &&
					(confirmDeletion ? (
						<ConfirmationDialog
							title={__('Delete item?')}
							actionText={__('Delete')}
							actionVariant="destructive"
							trigger={
								<IconButton
									variant="ghost"
									className="text-red-600"
									aria-label={label}
									size="sm"
								>
									<Trash size="20" />
								</IconButton>
							}
							onAction={onDelete}
							cancelText={__('Cancel')}
						>
							{sprintf(
								/* translators: %s: item label */
								__('Are you sure you want to delete "%s"?'),
								label,
							)}
							<span className="mt-4 block">{deletionWarning}</span>
						</ConfirmationDialog>
					) : (
						<IconButton
							variant="ghost"
							onClick={onDelete}
							icon={<Trash />}
							aria-label={__('Delete')}
						/>
					))}
			</div>
		</Popover>
	);
};
