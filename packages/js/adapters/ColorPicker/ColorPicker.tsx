import { HexColorPicker } from 'react-colorful';

type HexColorPickerProps = React.ComponentProps<typeof HexColorPicker>;

export interface ColorPickerProps
	extends Partial<Omit<HexColorPickerProps, 'color'>> {
	value?: string;
	ref?: unknown;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
	value,
	...props
}) => {
	return <HexColorPicker color={value} {...props} />;
};
