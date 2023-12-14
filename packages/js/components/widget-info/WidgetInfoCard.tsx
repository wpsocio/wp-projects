import { Stack, StackProps } from '@wpsocio/adapters';
import { __ } from '@wpsocio/i18n';
import { SectionCard } from '../section-card';

const bodyProps = { px: 0, py: 0 };

export interface WidgetInfoCardProps {
	spacing?: StackProps['spacing'];
	title?: string;
}

export const WidgetInfoCard: React.FC<
	React.PropsWithChildren<WidgetInfoCardProps>
> = ({ children, spacing = '1em', title }) => {
	return (
		<SectionCard title={title || __('Widget Info')} bodyProps={bodyProps}>
			<Stack spacing={spacing}>{children}</Stack>
		</SectionCard>
	);
};
