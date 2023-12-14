import { Flex, Box, Text } from '@wpsocio/adapters';
import { __ } from '@wpsocio/i18n';
import type { TestResult, TestResultType } from '@wpsocio/services';

interface MessageResultProps {
	messageResult: TestResult;
	messageResultType: TestResultType;
}

export const MessageResult: React.FC<MessageResultProps> = ({
	messageResult,
	messageResultType,
}) => {
	const testResults = Object.entries(messageResult);

	return testResults.length ? (
		<Box mt="1em">
			<Text color="gray.500">{__('Result:')}</Text>
			{testResults.map(([chat_id, result]) => {
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
									messageResultType?.[chat_id] === 'ERROR'
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
