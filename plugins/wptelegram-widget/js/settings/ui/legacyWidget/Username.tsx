import { useFormContext, useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { FormItem } from '@wpsocio/shared-ui/form/form-item';
import { useChatWithTest } from '@wpsocio/shared-ui/form/use-chat-with-test.js';
import {
	FormControl,
	FormField,
} from '@wpsocio/ui-components/wrappers/form.js';
import { Input } from '@wpsocio/ui-components/wrappers/input.js';
import { type DataShape, getFieldLabel } from '../../services';
import { PREFIX } from './constants';

export const Username: React.FC = () => {
	const [bot_token, chat_id] = useWatch<
		DataShape,
		[`${typeof PREFIX}.bot_token`, `${typeof PREFIX}.username`]
	>({
		name: [`${PREFIX}.bot_token`, `${PREFIX}.username`],
	});

	const { ButtonComponent, memberCount, result } = useChatWithTest(
		bot_token || '',
	);

	const { control } = useFormContext<DataShape>();

	return (
		<>
			<FormField
				control={control}
				name={`${PREFIX}.username`}
				render={({ field }) => (
					<FormItem
						label={getFieldLabel('username')}
						afterMessage={
							<>
								{memberCount}
								{result}
							</>
						}
						description={__('Channel or group username.')}
					>
						<FormControl className="max-w-[200px]">
							<Input
								wrapperClassName="max-w-max"
								addonStart="@"
								autoComplete="off"
								{...field}
							/>
						</FormControl>
						<ButtonComponent chat_id={chat_id || ''} />
					</FormItem>
				)}
			/>
		</>
	);
};
