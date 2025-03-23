import { __ } from '@wpsocio/i18n';
import type { ResultType } from '@wpsocio/services/api-fetch/types.js';
import { testBotToken } from '@wpsocio/services/telegram/telegram-utils.js';
import { Button } from '@wpsocio/ui/wrappers/button';
import { BOT_TOKEN_REGEX } from '@wpsocio/utilities/constants.js';
import type React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { RenderTestResult } from './test-result/render-test-result.js';

export type BotTokenTest = {
	bot_token: string;
	buttonNode: React.ReactNode;
	resultNode: React.ReactNode;
	bot_username?: string;
	testResult: string;
	testResultType: ResultType;
};

export const useBotTokenTest = (bot_token: string): BotTokenTest => {
	const [testingBotToken, setTestingBotToken] = useState('');

	const [bot_username, setBotUsername] = useState('');

	const [testResult, setTestResult] = useState('');
	const [testResultType, setTestResultType] = useState<ResultType>('SUCCESS');

	const onTestToken = useCallback(
		async (event: React.MouseEvent) => {
			setTestingBotToken(bot_token);

			const [resultType, result] = await testBotToken({ bot_token }, event);

			setTestingBotToken('');
			setTestResultType(resultType);
			setBotUsername('');

			if (
				result &&
				typeof result === 'object' &&
				'first_name' in result &&
				'username' in result &&
				typeof result.username === 'string'
			) {
				setTestResult(`${result.first_name} (@${result.username})`);
				setBotUsername(result.username);
			} else if (typeof result === 'string') {
				setTestResult(result);
			}
		},
		[bot_token],
	);

	return useMemo(() => {
		const buttonNode = (
			<Button
				onClick={onTestToken}
				className="flex-grow flex-shrink-0"
				variant="secondary"
				disabled={
					!bot_token ||
					!BOT_TOKEN_REGEX.test(bot_token) ||
					Boolean(testingBotToken)
				}
			>
				{testingBotToken && testingBotToken === bot_token
					? __('Please wait…')
					: __('Test Token')}
			</Button>
		);

		const resultNode = (
			<RenderTestResult result={testResult} resultType={testResultType} />
		);

		return {
			bot_token,
			buttonNode,
			onTestToken,
			resultNode,
			bot_username,
			testResult,
			testResultType,
		};
	}, [
		testResult,
		testResultType,
		bot_token,
		bot_username,
		onTestToken,
		testingBotToken,
	]);
};
