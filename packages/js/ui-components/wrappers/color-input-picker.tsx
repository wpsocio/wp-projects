import {
	type CSSProperties,
	forwardRef,
	useCallback,
	useMemo,
	useState,
} from 'react';
import { HexColorPicker } from 'react-colorful';
import { useDebouncedCallback } from 'use-debounce';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover.js';
import { Button } from './button.js';
import { Input, type InputProps } from './input.js';

export const ColorInputPicker = forwardRef<
	HTMLInputElement,
	Omit<InputProps, 'value' | 'onChange'> & {
		value?: string;
		onChange?: (newColor: string) => void;
	}
>(({ value, onChange, ...props }, ref) => {
	const [currentColor, setCurrentColor] = useState(value || '');

	const buttonStyle = useMemo<CSSProperties>(
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

	const debouncedOnChangeColor = useDebouncedCallback(onChangeColor, 100);

	return (
		<Popover>
			<Input
				{...props}
				ref={ref}
				addonStartClassName="p-0"
				addonStart={
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							className="rounded-e-none h-full"
							style={buttonStyle}
						/>
					</PopoverTrigger>
				}
				value={currentColor}
				className="max-w-[100px]"
				onChange={onChangeInput}
			/>
			<PopoverContent className="max-w-max">
				<HexColorPicker
					color={currentColor}
					onChange={debouncedOnChangeColor}
				/>
			</PopoverContent>
		</Popover>
	);
});
