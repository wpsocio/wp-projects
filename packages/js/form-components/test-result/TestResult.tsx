import { Box, Text } from '@wpsocio/adapters';
import { __ } from '@wpsocio/i18n';
import type { ResultType } from '@wpsocio/services';

interface RenderTestResultProps {
	result: React.ReactNode;
	resultType: ResultType;
}

export const RenderTestResult: React.FC<RenderTestResultProps> = ({
	result,
	resultType,
}) => {
	return result ? (
		<Box my="0.5em">
			<Text color="gray.500" as="i">
				{__('Test Result:')}
			</Text>{' '}
			<Text
				fontWeight="bold"
				color={resultType === 'ERROR' ? 'red.400' : 'green.500'}
				as="span"
			>
				{result}
			</Text>
		</Box>
	) : null;
};
