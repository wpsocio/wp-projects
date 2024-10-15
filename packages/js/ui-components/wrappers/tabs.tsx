import { Fragment } from 'react/jsx-runtime';
import {
	TabsContent,
	TabsList,
	TabsTrigger,
	Tabs as TabsUI,
} from '../ui/tabs.js';

export interface TabItemProps {
	id: string;
	title?: React.ReactNode;
	Component: React.ComponentType;
}

export interface TabsProps<ItemProps extends TabItemProps = TabItemProps>
	extends React.ComponentProps<typeof TabsUI> {
	items: Array<ItemProps>;
	renderTabTrigger?: (props: ItemProps) => React.ReactNode;
	renderTabContent?: (props: ItemProps) => React.ReactNode;
}

export function Tabs<ItemProps extends TabItemProps>({
	items,
	renderTabContent,
	renderTabTrigger,
	...props
}: TabsProps<ItemProps>) {
	return (
		<TabsUI {...props}>
			<TabsList className="h-auto flex-wrap justify-start gap-2">
				{items.map((props) => {
					return (
						<Fragment key={props.id}>
							<TabsTrigger value={props.id}>
								{renderTabTrigger?.(props) || props.title}
							</TabsTrigger>
						</Fragment>
					);
				})}
			</TabsList>
			{items.map((props) => {
				return (
					<Fragment key={props.id}>
						<TabsContent value={props.id}>
							{renderTabContent?.(props) || <props.Component />}
						</TabsContent>
					</Fragment>
				);
			})}
		</TabsUI>
	);
}
