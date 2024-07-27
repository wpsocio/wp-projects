import { Button, type ButtonProps } from '@wpsocio/adapters';
import { __ } from '@wpsocio/i18n';
import {
	type TestResult,
	type TestResultType,
	testBotToken,
} from '@wpsocio/services';
import { BOT_TOKEN_REGEX } from '@wpsocio/utilities';
import type React from 'react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { RenderTestResult } from './test-result';

export type BotTokenTest = {
	bot_token: string;
	buttonComponent: React.ComponentType<ButtonProps>;
	buttonNode: React.ReactNode;
	resultNode: React.ReactNode;
	bot_username?: string;
	testResult: TestResult;
	testResultType: TestResultType;
};

export const useBotTokenTest = (_bot_token_?: string): BotTokenTest => {
	const [testingBotToken, setTestingBotToken] = useState('');

	const [bot_token, setBotToken] = useState(_bot_token_ || '');
	const [bot_username, setBotUsername] = useState('');

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (_bot_token_ && _bot_token_ !== bot_token) {
			setBotToken(_bot_token_);
		}
	}, [_bot_token_]);

	const [testResult, setTestResult] = useState<TestResult>({});
	const [testResultType, setTestResultType] = useState<TestResultType>({});

	const onTestToken = useCallback(
		(bot_token: string) => async (event: React.MouseEvent) => {
			setBotToken(bot_token);
			setBotUsername('');

			await testBotToken(
				{
					bot_token,
					setInProgress: (inProgress) =>
						setTestingBotToken(inProgress ? bot_token : ''),
					setResult: (result) => {
						setTestResult((prevState) => ({
							...prevState,
							[bot_token]: result,
						}));
					},
					setResultType: (resultType) => {
						setTestResultType((prevState) => ({
							...prevState,
							[bot_token]: resultType,
						}));
					},
					onComplete: (token, result) => {
						setBotToken(token);
						if (
							result &&
							typeof result === 'object' &&
							'username' in result &&
							typeof result.username === 'string'
						) {
							setBotUsername(result.username);
						}
					},
				},
				event,
			);
		},
		[],
	);

	const onClickTest = useCallback<React.MouseEventHandler>(
		async (event) => {
			await onTestToken(bot_token)(event);
		},
		[bot_token, onTestToken],
	);

	const buttonComponent = memo<ButtonProps>(({ value: bot_token }) => {
		return (
			<Button
				isDisabled={
					!bot_token ||
					!BOT_TOKEN_REGEX.test(bot_token as string) ||
					Boolean(testingBotToken)
				}
				onClick={onTestToken(bot_token as string)}
				borderStartRadius="0"
			>
				{testingBotToken && testingBotToken === bot_token
					? __('Please wait…')
					: __('Test Token')}
			</Button>
		);
	});

	return useMemo(() => {
		const buttonNode = (
			<Button
				onClick={onClickTest}
				borderStartRadius="0"
				isDisabled={
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
			<RenderTestResult
				result={testResult[bot_token]}
				resultType={testResultType[bot_token]}
			/>
		);

		return {
			bot_token,
			buttonNode,
			buttonComponent,
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
		buttonComponent,
		onClickTest,
		testingBotToken,
	]);
};
