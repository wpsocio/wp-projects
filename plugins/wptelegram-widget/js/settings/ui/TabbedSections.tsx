import { useFormState } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { useActiveTab } from '@wpsocio/services/use-active-tab.js';
import { Warning } from '@wpsocio/ui/icons';
import { cn } from '@wpsocio/ui/lib/utils';
import { Card } from '@wpsocio/ui/wrappers/card';
import { type TabItemProps, Tabs } from '@wpsocio/ui/wrappers/tabs';
import { useCallback } from 'react';
import { Advanced } from './advanced';
import { AjaxWidget } from './ajaxWidget';
import { JoinLink } from './joinLink';
import { LegacyWidget } from './legacyWidget';

type WidgetTabItem = TabItemProps & { description?: string };

const getTabs = (): Array<WidgetTabItem> => [
	{
		id: 'ajax_widget',
		title: __('Ajax Widget'),
		Component: AjaxWidget,
		description: __(
			'Ajax widget is a beautiful scrollable widget which only supports channels.',
		),
	},
	{
		id: 'legacy_widget',
		title: __('Legacy Widget'),
		Component: LegacyWidget,
		description: __(
			'Legacy widget is a full height widget which supports both channels and groups.',
		),
	},
	{
		id: 'join_link',
		title: __('Join Link'),
		Component: JoinLink,
		description: __('Join link can be automatically added to posts.'),
	},
	{
		id: 'advanced',
		title: __('Advanced'),
		Component: Advanced,
	},
];

export const TabbedSections: React.FC = () => {
	const { submitCount, errors } = useFormState();

	const { getActiveTab, setActiveTab } = useActiveTab(
		'wptelegram_widget_settings',
	);

	const renderTabTrigger = useCallback(
		({ id, title }: WidgetTabItem) => {
			const showError = Boolean(submitCount) && id && id in errors;

			return (
				<span
					className={cn('flex flex-row items-center justify-between', {
						'text-destructive': showError,
						'font-bold': showError,
					})}
				>
					{showError && <Warning />}
					&nbsp;
					{title}
				</span>
			);
		},
		[errors, submitCount],
	);

	const renderTabContent = useCallback(
		({ title, Component, description }: WidgetTabItem) => {
			return (
				<Card
					title={description ? title : undefined}
					className="w-full border-0 shadow-none"
					description={description}
					titleClassName="text-xl"
				>
					<Component />
				</Card>
			);
		},
		[],
	);

	return (
		<Tabs
			defaultValue={getActiveTab('ajax_widget')}
			items={getTabs()}
			onValueChange={setActiveTab}
			renderTabTrigger={renderTabTrigger}
			renderTabContent={renderTabContent}
		/>
	);
};
