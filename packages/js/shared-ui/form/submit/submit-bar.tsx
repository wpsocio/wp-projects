import { useFormState } from '@wpsocio/form';
import { Separator } from '@wpsocio/ui/components/separator';
import { useCallback } from 'react';
import { ResetButton } from './reset-button.js';
import { SubmitButton } from './submit-button.js';
import { SubmitButtons } from './submit-buttons.js';

interface SubmitBarProps extends React.HTMLAttributes<HTMLDivElement> {
	onSubmit?: VoidFunction;
	onReset?: VoidFunction;
	showResetButton?: boolean;
	showSeparator?: boolean;
	form?: string;
}

export const SubmitBar: React.FC<SubmitBarProps> = ({
	onSubmit,
	onReset,
	showResetButton,
	form,
	showSeparator = true,
	...props
}) => {
	const { isSubmitting, isDirty } = useFormState();

	// To avoid unexpected arguments being passed to callbacks
	const onClickSubmit = useCallback(() => onSubmit?.(), [onSubmit]);
	const onClickReset = useCallback(() => onReset?.(), [onReset]);

	return (
		<>
			{showSeparator && <Separator />}
			<SubmitButtons {...props}>
				<SubmitButton
					isLoading={isSubmitting}
					disabled={isSubmitting}
					onClick={onClickSubmit}
					form={form}
				/>
				{showResetButton && (
					<ResetButton disabled={!isDirty} form={form} onClick={onClickReset} />
				)}
			</SubmitButtons>
		</>
	);
};
