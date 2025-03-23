import { __ } from '@wpsocio/i18n';
import { Link } from '@wpsocio/ui/wrappers/link';

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
