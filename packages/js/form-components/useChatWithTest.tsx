import { Button, ButtonProps } from '@wpsocio/adapters';
import { __ } from '@wpsocio/i18n';
import {
	TestResult,
	TestResultType,
	checkMemberCount,
	sendTestMessage,
} from '@wpsocio/services';
import { fixChatId } from '@wpsocio/utilities';
import { memo, useCallback, useMemo, useState } from 'react';
import { MemberCountResult, MessageResult } from './test-result';

export type ChatWithTest = {
	button: typeof Button;
	result: React.ReactNode;
	memberCount?: React.ReactNode;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	testResult: TestResult;
	testResultType: TestResultType;
};

export const useChatWithTest = (
	bot_token?: string,
	fixUsername = true,
): ChatWithTest => {
	const [checkingMemberCount, setCheckingMemberCount] = useState<{
		[K in string]?: boolean;
	}>({});
	const [memberCountResult, setMemberCountResult] = useState<TestResult>({});
	const [memberCountResultType, setMemberCountResultType] =
		useState<TestResultType>({});

	const [sendingTestMessage, setSendingTestMessage] = useState('');
	const [testResult, setTestResult] = useState<TestResult>({});
	const [testResultType, setTestResultType] = useState<TestResultType>({});

	const onClickTest = useCallback(
		(chatId: string): React.MouseEventHandler =>
			async (event) => {
				if (!bot_token) {
					return;
				}
				const chat_id = fixUsername ? fixChatId(chatId) : chatId;
				setMemberCountResult({});
				await sendTestMessage(
					{
						bot_token,
						chat_id,
						text: '',
						setInProgress: (val) => setSendingTestMessage(val ? chat_id : ''),
						setResult: (result) =>
							setTestResult({
								...testResult,
								[chatId]: result,
							}),
						setResultType: (resultType) =>
							setTestResultType({
								...testResultType,
								[chatId]: resultType,
							}),
					},
					event,
				);
			},
		[bot_token, fixUsername, testResult, testResultType],
	);

	const onBlur = useCallback<React.FocusEventHandler<HTMLInputElement>>(
		async ({ nativeEvent: e }) => {
			setTestResult({});
			const chatId = (e.target as HTMLInputElement)?.value;
			if (!bot_token || !chatId || checkingMemberCount[chatId]) {
				return;
			}
			const chat_id = fixUsername ? fixChatId(chatId) : chatId;

			await checkMemberCount({
				bot_token,
				chat_id,
				setInProgress: (val) =>
					setCheckingMemberCount((prevState) => ({
						...prevState,
						[chatId]: val,
					})),
				setResult: (result) =>
					setMemberCountResult((prevState) => ({
						...prevState,
						[chatId]: result,
					})),
				setResultType: (resultType) =>
					setMemberCountResultType((prevState) => ({
						...prevState,
						[chatId]: resultType,
					})),
			});
		},
		[bot_token, checkingMemberCount, fixUsername],
	);

	const button = memo<ButtonProps>(({ value: chat_id, isDisabled }) => {
		return (
			<Button
				isDisabled={
					!bot_token || isDisabled || Boolean(sendingTestMessage) || !chat_id
				}
				onClick={onClickTest(chat_id?.toString() || '')}
				borderStartRadius="0"
			>
				{sendingTestMessage && sendingTestMessage === chat_id
					? __('Please wait…')
					: __('Send Test')}
			</Button>
		);
	}) as typeof Button;

	return useMemo(() => {
		const result = (
			<MessageResult
				messageResult={testResult}
				messageResultType={testResultType}
			/>
		);

		const memberCount = (
			<MemberCountResult
				memberCountResult={memberCountResult}
				memberCountResultType={memberCountResultType}
			/>
		);

		return { button, result, memberCount, onBlur, testResult, testResultType };
	}, [
		button,
		memberCountResult,
		memberCountResultType,
		onBlur,
		testResult,
		testResultType,
	]);
};
