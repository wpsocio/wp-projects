import {
	Button,
	type ButtonProps,
	type InputAddonProps,
	type InputProps,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
} from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { TextInput } from '../Input';
import { useDebouncedCallback } from '../hooks';
import { ColorPicker, type ColorPickerProps } from './ColorPicker';

const addonBeforeProps: InputAddonProps = { px: '0px', py: '0px' };

export const ColorInputPicker: React.FC<ColorPickerProps> = ({
	value,
	onChange,
	...props
}) => {
	const [currentColor, setCurrentColor] = useState(value || '');

	const buttonProps = useMemo<ButtonProps>(
		() => ({ backgroundColor: currentColor }),
		[currentColor],
	);

	const onChangeInput = useCallback<NonNullable<InputProps['onChange']>>(
		(event) => {
			const newColor = event.target.value;

			onChange?.(newColor);
			setCurrentColor(newColor);
		},
		[onChange],
	);

	const onChangeColor = useCallback(
		(newColor: string) => {
			onChange?.(newColor);
			setCurrentColor(newColor);
		},
		[onChange],
	);

	const debouncedOnChangeColor = useDebouncedCallback(onChangeColor, 200);

	return (
		<Popover placement="bottom">
			<TextInput
				addonBeforeProps={addonBeforeProps}
				addonBefore={
					<PopoverTrigger>
						<Button
							variant="ghost"
							borderEndRadius="0px"
							height="100%"
							{...buttonProps}
							_hover={buttonProps}
							_active={buttonProps}
						/>
					</PopoverTrigger>
				}
				value={currentColor}
				maxWidth="100px"
				onChange={onChangeInput}
			/>
			<PopoverContent maxW="max-content">
				<PopoverBody padding="0px">
					<ColorPicker
						value={currentColor}
						onChange={debouncedOnChangeColor}
						{...props}
					/>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};
