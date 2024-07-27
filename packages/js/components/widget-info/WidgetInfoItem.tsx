import { type BoxProps, StackItem as StackedItem } from '@wpsocio/adapters';

export const WidgetInfoItem: React.FC<BoxProps> = (props) => {
	return (
		<StackedItem
			p="1em"
			textAlign="center"
			borderBottom="1px"
			borderBottomColor="gray.200"
			width="100%"
			{...props}
		/>
	);
};
