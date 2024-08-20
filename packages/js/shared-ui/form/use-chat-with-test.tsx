import { __ } from '@wpsocio/i18n';
import type {
	TestResult,
	TestResultType,
} from '@wpsocio/services/apiFetch/types.js';
import {
	checkMemberCount,
	sendTestMessage,
} from '@wpsocio/services/telegram/TelegramUtils.js';
import {
	Button,
	type ButtonProps,
} from '@wpsocio/ui-components/wrappers/button.js';
import { fixChatId } from '@wpsocio/utilities/misc.js';
import { memo, useCallback, useMemo, useState } from 'react';
import { MemberCountResult } from './test-result/member-count-result.js';
import { MessageResult } from './test-result/message-result.js';

export type ChatWithTest = {
	ButtonComponent: React.ComponentType<ButtonProps & { chat_id: string }>;
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
						setInProgress(val) {
							setSendingTestMessage(val ? chat_id : '');
						},
						setResult(result) {
							setTestResult({
								...testResult,
								[chatId]: result,
							});
						},
						setResultType(resultType) {
							setTestResultType({
								...testResultType,
								[chatId]: resultType,
							});
						},
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

	const ButtonComponent = memo<
		React.ComponentProps<ChatWithTest['ButtonComponent']>
	>(({ chat_id, disabled }) => {
		return (
			<Button
				disabled={
					!bot_token || disabled || Boolean(sendingTestMessage) || !chat_id
				}
				onClick={onClickTest(chat_id?.toString() || '')}
				// className="flex-grow flex-shrink-0"
				variant="secondary"
			>
				{sendingTestMessage && sendingTestMessage === chat_id
					? __('Please wait…')
					: __('Send Test')}
			</Button>
		);
	});

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

		return {
			ButtonComponent,
			result,
			memberCount,
			onBlur,
			testResult,
			testResultType,
		};
	}, [
		ButtonComponent,
		memberCountResult,
		memberCountResultType,
		onBlur,
		testResult,
		testResultType,
	]);
};
