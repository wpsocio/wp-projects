import { type CSSProperties, useCallback } from 'react';

import { Tab, Tabs, type TabsProps, Text } from '@wpsocio/adapters';
import { useFormState } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { WarningIcon } from '@wpsocio/icons';
import { useActiveTab } from '@wpsocio/services';

import { Advanced } from './advanced';
import { AjaxWidget } from './ajaxWidget';
import { JoinLink } from './joinLink';
import { LegacyWidget } from './legacyWidget';

const getTabs = () => [
	{
		id: 'ajax_widget',
		title: __('Ajax Widget'),
		Component: AjaxWidget,
	},
	{
		id: 'legacy_widget',
		title: __('Legacy Widget'),
		Component: LegacyWidget,
	},
	{
		id: 'join_link',
		title: __('Join Link'),
		Component: JoinLink,
	},
	{
		id: 'advanced',
		title: __('Advanced'),
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

	const { getActiveTab, setActiveTab } = useActiveTab('wptelegram_widget');

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
