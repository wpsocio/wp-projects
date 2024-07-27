import { Box, Flex, Heading, Text } from '@wpsocio/adapters';
import type { BaseAssetsData, PluginInfo } from '@wpsocio/services';
import { Description } from '../Description';

import { SectionCard, type SectionCardProps } from '../section-card';

export interface PluginHeaderProps
	extends PluginInfo,
		Omit<SectionCardProps, 'title'> {
	assets: BaseAssetsData;
	socialIcons?: React.ReactNode;
}

const headerOverflow = ['hidden', 'inherit'];
const headerMaxWidth = ['80%', '90%'];

export const PluginHeader: React.FC<PluginHeaderProps> = ({
	assets,
	title,
	version,
	description,
	socialIcons,
	...sectionCardProps
}) => {
	return (
		<SectionCard
			title={
				<Flex alignItems="center">
					{assets.logoUrl && (
						<Box
							alt={title}
							as="img"
							className="header-logo"
							display="inline-block"
							h="2rem"
							marginEnd="0.5em"
							src={assets.logoUrl}
							verticalAlign="middle"
							w="2rem"
						/>
					)}
					<Box width="100%">
						<Heading
							as="h4"
							size="md"
							fontWeight={600}
							display="inline-block"
							m={0}
							maxWidth={headerMaxWidth}
							whiteSpace="nowrap"
							textOverflow="ellipsis"
							overflow={headerOverflow}
							lineHeight={1.3}
						>
							{title}
						</Heading>
						<Text as="span" fontSize="80%" fontStyle="italic" color="gray.500">
							&nbsp;v{version}
						</Text>
					</Box>
				</Flex>
			}
			{...sectionCardProps}
		>
			<Description>{description}</Description>
			{socialIcons}
		</SectionCard>
	);
};
