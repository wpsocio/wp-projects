import { Box } from '@wpsocio/adapters';

export interface CollapseProps {
	title: string;
	body?: React.ReactNode;
}

export const Collapse: React.FC<React.PropsWithChildren<CollapseProps>> = ({
	body,
	children,
	title,
}) => {
	return (
		<details style={{ borderBlock: '1px solid #E2E8F0' }}>
			<summary style={{ paddingBlock: '0.5rem', cursor: 'pointer' }}>
				{title}
			</summary>
			<Box paddingBottom="1rem">{body || children}</Box>
		</details>
	);
};
