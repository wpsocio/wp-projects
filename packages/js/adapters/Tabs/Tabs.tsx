import {
	Tabs as ChakraTabs,
	type TabsProps as ChakraTabsProps,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
} from '@chakra-ui/react';
import { useMemo } from 'react';

export interface TabItemProps {
	id?: string;
	title?: React.ReactNode;
}

export interface TabItem extends TabItemProps {
	Component: React.ComponentType;
}

export interface TabsProps extends Partial<ChakraTabsProps> {
	items: Array<TabItem>;
	renderTab?: (props: TabItemProps) => React.ReactNode;
	renderPanel?: (props: TabItemProps) => React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
	items,
	renderPanel,
	renderTab,
	...rest
}) => {
	const { tabList, tabPanels } = useMemo(() => {
		return items.reduce<{
			tabList: Array<React.ReactNode>;
			tabPanels: Array<React.ReactNode>;
		}>(
			(bucket, { Component, id, title }, index) => {
				const tab = renderTab?.({ id, title }) || (
					<Tab key={id || index}>{title}</Tab>
				);

				const panel = renderPanel?.({ id, title }) || (
					<TabPanel key={id || index}>
						<Component />
					</TabPanel>
				);

				bucket.tabList.push(tab);
				bucket.tabPanels.push(panel);

				return bucket;
			},
			{ tabList: [], tabPanels: [] },
		);
	}, [items, renderPanel, renderTab]);

	return (
		<ChakraTabs {...rest}>
			<TabList mb="1em" flexWrap="wrap">
				{tabList}
			</TabList>
			<TabPanels>{tabPanels}</TabPanels>
		</ChakraTabs>
	);
};
