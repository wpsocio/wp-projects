import { Link } from '@wpsocio/adapters';
import { __ } from '@wpsocio/i18n';

interface InstructionsLinkProps {
	link: string;
	text?: string;
}

export const InstructionsLink: React.FC<
	React.PropsWithChildren<InstructionsLinkProps>
> = ({ link, text, children }) => {
	return (
		<Link href={link} isExternal>
			{text || children || __('Click here for instructions.')}
		</Link>
	);
};
