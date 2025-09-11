import {
	Button,
	Flex,
	FlexBlock,
	FlexItem,
	__experimentalHeading as Heading,
	__experimentalView as View,
} from '@wordpress/components';
import { __, isRTL } from '@wpsocio/i18n';
import { chevronLeft, chevronRight } from '@wpsocio/ui/icons/wp';
import styles from './styles.module.scss';

export interface PluginSubPageProps {
	title: string;
	description?: string;
	children?: React.ReactNode;
	onClickBack?: VoidFunction;
	backButtonLabel?: string;
	headerAction?: React.ReactNode;
}

export const PluginSubPage: React.FC<PluginSubPageProps> = ({
	title,
	description,
	children,
	onClickBack,
	headerAction,
	backButtonLabel,
}) => {
	return (
		<View className={styles.container}>
			<Flex className={styles.header} align="start" gap={4}>
				<FlexBlock>
					<Flex justify="start" gap={4} wrap>
						{onClickBack ? (
							<View>
								<Button
									onClick={onClickBack}
									label={__('Go back')}
									icon={isRTL() ? chevronRight : chevronLeft}
								>
									{backButtonLabel}
								</Button>
							</View>
						) : null}
						<View>
							<Heading level={2} className={styles.title}>
								{title}
							</Heading>
							<View className={styles.description}>{description}</View>
						</View>
					</Flex>
				</FlexBlock>
				<FlexItem>{headerAction}</FlexItem>
			</Flex>
			<View className={styles.content}>{children}</View>
		</View>
	);
};
