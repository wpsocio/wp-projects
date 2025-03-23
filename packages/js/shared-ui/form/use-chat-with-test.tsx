import { __ } from '@wpsocio/i18n';
import type { TestResultType } from '@wpsocio/services/api-fetch/types.js';
import {
	checkMemberCount,
	sendTestMessage,
} from '@wpsocio/services/telegram/telegram-utils.js';
import { Button, type ButtonProps } from '@wpsocio/ui/wrappers/button';
import { fixChatId } from '@wpsocio/utilities/misc.js';
import { memo, useCallback, useMemo, useState } from 'react';
import {
	MemberCountResult,
	type MemberCountResultProps,
} from './test-result/member-count-result.js';
import {
	TestMessageResult,
	type TestMessageResultProps,
} from './test-result/test-message-result.js';

export type ChatWithTest = {
	ButtonComponent: React.ComponentType<ButtonProps & { chat_id: string }>;
	result: React.ReactNode;
	memberCount?: React.ReactNode;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	testResult?: TestMessageResultProps;
};

export const useChatWithTest = (
	bot_token?: string,
	fixUsername = true,
): ChatWithTest => {
	const [checkingMemberCount, setCheckingMemberCount] = useState('');
	const [memberCountResult, setMemberCountResult] =
		useState<MemberCountResultProps>();
	useState<TestResultType>({});

	const [sendingTestMessage, setSendingTestMessage] = useState('');
	const [testResult, setTestResult] = useState<TestMessageResultProps>();

	const onClickTest = useCallback(
		(chatId: string): React.MouseEventHandler =>
			async (event) => {
				if (!bot_token) {
					return;
				}
				const chat_id = fixUsername ? fixChatId(chatId) : chatId;

				setSendingTestMessage(chat_id);

				const [resultType, result] = await sendTestMessage(
					{ bot_token, chat_id, text: '' },
					event,
				);
				setSendingTestMessage('');

				setTestResult({ chatId, result, resultType });
			},
		[bot_token, fixUsername],
	);

	const onBlur = useCallback<React.FocusEventHandler<HTMLInputElement>>(
		async ({ nativeEvent: e }) => {
			const chatId = (e.target as HTMLInputElement)?.value;
			if (!bot_token || !chatId || checkingMemberCount === chatId) {
				return;
			}
			const chat_id = fixUsername ? fixChatId(chatId) : chatId;

			setCheckingMemberCount(chat_id);

			const [resultType, result] = await checkMemberCount({
				bot_token,
				chat_id,
			});
			setCheckingMemberCount('');
			setMemberCountResult({ chatId, result, resultType });
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
				variant="secondary"
			>
				{sendingTestMessage && sendingTestMessage === chat_id
					? __('Please wait…')
					: __('Send Test')}
			</Button>
		);
	});

	return useMemo(() => {
		const result = <TestMessageResult {...testResult} />;

		const memberCount = <MemberCountResult {...memberCountResult} />;

		return {
			ButtonComponent,
			result,
			memberCount,
			onBlur,
			testResult,
		};
	}, [ButtonComponent, memberCountResult, onBlur, testResult]);
};
