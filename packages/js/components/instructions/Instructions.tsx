import { __ } from '@wpsocio/i18n';
import { SectionCard, SectionCardProps } from '../section-card';

const headerProps = {
	backgroundColor: '#343a40',
	color: '#fff',
};

export interface InstructionsProps extends SectionCardProps {
	highContrast?: boolean;
}

export const Instructions: React.FC<Partial<InstructionsProps>> = ({
	children,
	highContrast = true,
	...rest
}) => {
	return (
		<SectionCard
			title={__('INSTRUCTIONS!')}
			headerProps={highContrast ? headerProps : undefined}
			{...rest}
		>
			{children}
		</SectionCard>
	);
};
