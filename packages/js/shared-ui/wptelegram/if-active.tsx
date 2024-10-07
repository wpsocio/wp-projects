import { useWatch } from '@wpsocio/form';
import {
	Collapsible,
	CollapsibleContent,
} from '@wpsocio/ui-components/ui/collapsible.js';

export type IfActiveProps = {
	name: string;
} & (
	| { children: (isActive: boolean) => React.ReactNode }
	| { children: React.ReactNode }
);

export const IfActive: React.FC<IfActiveProps> = ({ children, name }) => {
	const active: boolean = useWatch({ name });

	return (
		<Collapsible open={active}>
			<CollapsibleContent>
				{'function' === typeof children ? children(active) : children}
			</CollapsibleContent>
		</Collapsible>
	);
};
