import {
	Table as TableUI,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table.js';

export type TableColumn = {
	id: string;
	label?: React.ReactNode;
} & React.ComponentProps<typeof TableHead>;

export type TableDataItem = {
	id: string;
	value: React.ReactNode;
} & React.ComponentProps<typeof TableCell>;

export type TableData = {
	id: string;
	items: Array<TableDataItem>;
};

export type TableProps = {
	caption?: string;
	columns: Array<TableColumn>;
	children?: Array<TableData>;
	data?: Array<TableData>;
} & Omit<React.ComponentProps<typeof TableUI>, 'children'>;

export function Table({
	caption,
	columns,
	data,
	children,
	...props
}: TableProps) {
	const tableData = data || children || [];

	return (
		<TableUI {...props}>
			{caption ? <TableCaption>{caption}</TableCaption> : null}
			<TableHeader>
				<TableRow>
					{columns.map(({ id, label, children, ...props }) => (
						<TableHead key={id} {...props}>
							{label || children}
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{tableData.map(({ id, items }) => (
					<TableRow key={id}>
						{items.map(({ id, value, ...props }) => (
							<TableCell key={id} {...props}>
								{value}
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</TableUI>
	);
}
