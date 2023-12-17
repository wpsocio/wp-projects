import { CSSProperties, useCallback } from 'react';

import { Tab, Tabs, TabsProps, Text } from '@wpsocio/adapters';
import { useFormState } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { WarningIcon } from '@wpsocio/icons';
import { useActiveTab } from '@wpsocio/services';

import { Advanced } from './advanced';
import { Basics } from './basics';
import { Notify } from './notify';
import { P2TG } from './p2tg';
import { ProxyUI } from './proxy';

const getTabs = () => [
	{
		id: 'basic',
		title: __('Basics'),
		Component: Basics,
	},
	{
		id: 'p2tg',
		title: __('Post to Telegram'),
		Component: P2TG,
	},
	{
		id: 'notify',
		title: __('Private Notifications'),
		Component: Notify,
	},
	{
		id: 'proxy',
		title: __('Proxy'),
		Component: ProxyUI,
	},
	{
		id: 'advanced',
		title: __('Advanced settings'),
		Component: Advanced,
	},
];

const tabTitleStyle: CSSProperties = {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'space-between',
};

export const TabbedSections: React.FC = () => {
	const { submitCount, errors } = useFormState();

	const { getActiveTab, setActiveTab } = useActiveTab('wptelegram');

	const renderTab = useCallback<NonNullable<TabsProps['renderTab']>>(
		({ id, title }) => {
			const showError = Boolean(submitCount) && id && id in errors;

			const tabTitle = (
				<Text
					style={tabTitleStyle}
					color={showError ? 'red.500' : ''}
					fontWeight={showError ? 'bold' : ''}
				>
					{showError && <WarningIcon />}
					&nbsp;
					{title}
				</Text>
			);
			return <Tab key={id}>{tabTitle}</Tab>;
		},
		[errors, submitCount],
	);

	return (
		<Tabs
			defaultIndex={getActiveTab(0)}
			items={getTabs()}
			onChange={setActiveTab}
			renderTab={renderTab}
		/>
	);
};
