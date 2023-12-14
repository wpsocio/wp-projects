import { Box, Flex, Text } from '@wpsocio/adapters';
import { __ } from '@wpsocio/i18n';
import type { TestResult, TestResultType } from '@wpsocio/services';

interface MemberCountResultProps {
	memberCountResult: TestResult;
	memberCountResultType: TestResultType;
}

export const MemberCountResult: React.FC<MemberCountResultProps> = ({
	memberCountResult,
	memberCountResultType,
}) => {
	const result = Object.entries(memberCountResult);

	return result.length ? (
		<Box mt="1em">
			<Text color="gray.500">{__('Members Count:')}</Text>
			{result.map(([chat_id, result]) => {
				return (
					<Flex key={chat_id} py="1em" wrap="wrap">
						<Box minW="150px">
							<Text fontWeight="bold" as="span">
								{chat_id}
							</Text>
						</Box>
						<Box ml="1em">
							<Text
								fontWeight="bold"
								color={
									memberCountResultType?.[chat_id] === 'ERROR'
										? 'red.400'
										: 'green.500'
								}
								as="span"
							>
								{result}
							</Text>
						</Box>
					</Flex>
				);
			})}
		</Box>
	) : null;
};
