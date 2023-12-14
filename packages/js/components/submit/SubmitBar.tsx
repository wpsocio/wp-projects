import { useCallback } from 'react';

import type { ButtonGroupProps } from '@wpsocio/adapters';
import { useFormState } from '@wpsocio/form';
import { ResetButton } from './ResetButton';
import { SubmitButton } from './SubmitButton';
import { SubmitButtons } from './SubmitButtons';

interface SubmitBarProps extends ButtonGroupProps {
	onSubmit?: VoidFunction;
	onReset?: VoidFunction;
	showResetButton?: boolean;
	form?: string;
}

export const SubmitBar: React.FC<SubmitBarProps> = ({
	onSubmit,
	onReset,
	showResetButton,
	form,
	...props
}) => {
	const { isSubmitting, isDirty } = useFormState();

	// To avoid unexpected arguments being passed to callbacks
	const onClickSubmit = useCallback(() => onSubmit?.(), [onSubmit]);
	const onClickReset = useCallback(() => onReset?.(), [onReset]);

	return (
		<SubmitButtons {...props}>
			<SubmitButton
				isLoading={isSubmitting}
				onClick={onClickSubmit}
				form={form}
			/>
			{showResetButton && (
				<ResetButton isDisabled={!isDirty} form={form} onClick={onClickReset} />
			)}
		</SubmitButtons>
	);
};
