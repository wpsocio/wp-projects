import {
	__experimentalDivider as Divider,
	Flex,
	FlexBlock,
	__experimentalView as View,
} from '@wordpress/components';
import { __experimentalHeading as Heading } from '@wordpress/components';
import styles from './styles.module.scss';

export interface PluginHeaderProps {
	title: string;
	description?: string;
	version?: string;
	logoUrl?: string;
}

export const PluginHeader: React.FC<PluginHeaderProps> = ({
	logoUrl,
	title,
	version,
	description,
}) => {
	return (
		<Flex className={styles.container} gap={4} direction="column">
			<FlexBlock>
				<Flex gap={2} justify="start">
					{logoUrl && (
						<div className={styles.logo}>
							<img alt={title} src={logoUrl} />
						</div>
					)}
					<Heading level={1} className={styles.title}>
						{title}
						{version ? (
							<View className={styles.version} as="span">
								&nbsp;v{version}
							</View>
						) : null}
					</Heading>
				</Flex>
			</FlexBlock>
			{description ? (
				<FlexBlock className={styles.description} as="span">
					{description}
				</FlexBlock>
			) : null}
			<Divider />
		</Flex>
	);
};
