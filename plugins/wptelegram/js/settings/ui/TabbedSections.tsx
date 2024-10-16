import { useFormState } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { useActiveTab } from '@wpsocio/services/use-active-tab.js';
import { cn } from '@wpsocio/ui-components';
import { AlertCircle as WarningIcon } from '@wpsocio/ui-components/icons';
import { Card } from '@wpsocio/ui-components/wrappers/card.js';
import {
	type TabItemProps,
	Tabs,
} from '@wpsocio/ui-components/wrappers/tabs.js';
import { useCallback } from 'react';
import { AdvancedTab } from './advanced/tab.js';
import { BasicsTab } from './basics/tab.js';
import { NotifyTab } from './notify/tab.js';
import { P2TGTab } from './p2tg/tab.js';
import { ProxyTab } from './proxy/tab.js';

type TabItem = TabItemProps & { description?: string };

const getTabs = (): Array<TabItem> => [
	{
		id: 'basics',
		title: __('Basics'),
		Component: BasicsTab,
		description: __('Set up your bot that you want to use.'),
	},
	{
		id: 'p2tg',
		title: __('Post to Telegram'),
		Component: P2TGTab,
		description: __(
			'With this module, you can configure how the posts are sent to Telegram.',
		),
	},
	{
		id: 'notify',
		title: __('Private Notifications'),
		Component: NotifyTab,
		description: __(
			'The module will watch the Email Notifications sent from this site and deliver them to you on Telegram.',
		),
	},
	{
		id: 'proxy',
		title: __('Proxy'),
		Component: ProxyTab,
		description: __(
			'The module will help you bypass the ban on Telegram by making use of proxy.',
		),
	},

	{
		id: 'advanced',
		title: __('Advanced settings'),
		Component: AdvancedTab,
		description: __(
			'Settings in this section should not be changed unless recommended by WP Telegram Support.',
		),
	},
];

export const TabbedSections: React.FC = () => {
	const { submitCount, errors } = useFormState();

	const { getActiveTab, setActiveTab } = useActiveTab('wptelegram_settings');

	const renderTabTrigger = useCallback(
		({ id, title }: TabItem) => {
			const showError = Boolean(submitCount) && id && id in errors;

			return (
				<span
					className={cn('flex flex-row items-center justify-between', {
						'text-destructive': showError,
						'font-bold': showError,
					})}
				>
					{showError && <WarningIcon />}
					&nbsp;
					{title}
				</span>
			);
		},
		[errors, submitCount],
	);

	const renderTabContent = useCallback(
		({ title, Component, description }: TabItem) => {
			return (
				<Card
					title={description ? title : undefined}
					className="w-full border-0"
					description={description}
					titleClassName="text-xl"
					headerClassName="px-2"
					contentClassName="px-2"
				>
					<Component />
				</Card>
			);
		},
		[],
	);

	return (
		<Tabs
			defaultValue={getActiveTab('basics')}
			items={getTabs()}
			onValueChange={setActiveTab}
			renderTabTrigger={renderTabTrigger}
			renderTabContent={renderTabContent}
		/>
	);
};
