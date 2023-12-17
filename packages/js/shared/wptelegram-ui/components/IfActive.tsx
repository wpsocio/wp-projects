import { useWatch } from '@wpsocio/form';
import { Collapse } from '@wpsocio/adapters';

export type IfActiveProps = {
	name: string;
} & (
	| { children: (isActive: boolean) => React.ReactNode }
	| { children: React.ReactNode }
);

export const IfActive: React.FC<IfActiveProps> = ({ children, name }) => {
	const active: boolean = useWatch({ name });

	return (
		<Collapse in={active} animateOpacity>
			{'function' === typeof children ? children(active) : children}
		</Collapse>
	);
};
