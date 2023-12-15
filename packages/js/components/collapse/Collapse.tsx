import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
} from '@wpsocio/adapters';

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
		<Accordion allowToggle>
			<AccordionItem>
				<AccordionButton>
					<Box flex="1" textAlign="start">
						{title}
					</Box>
					<AccordionIcon />
				</AccordionButton>
				<AccordionPanel>
					<Box>{body || children}</Box>
				</AccordionPanel>
			</AccordionItem>
		</Accordion>
	);
};
