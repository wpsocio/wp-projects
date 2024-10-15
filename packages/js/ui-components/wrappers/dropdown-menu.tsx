import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenu as DropdownMenuUI,
} from '../ui/dropdown-menu.js';

export type DropdownMenuProps = React.ComponentProps<typeof DropdownMenuUI> & {
	trigger: React.ReactNode;
	label: React.ReactNode;
	items?: Array<React.ComponentProps<typeof DropdownMenuItem> & { id: string }>;
	children?: Array<React.ReactNode>;
};

export function DropdownMenu({
	trigger,
	label,
	children,
	items,
	...props
}: DropdownMenuProps) {
	return (
		<DropdownMenuUI {...props}>
			<DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>{label}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{children ||
					items?.map((props) => <DropdownMenuItem key={props.id} {...props} />)}
			</DropdownMenuContent>
		</DropdownMenuUI>
	);
}
