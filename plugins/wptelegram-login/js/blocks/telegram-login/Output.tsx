import type { BlockEditProps } from '@wordpress/blocks';

import type { TelegramLoginAtts } from './types';
import { useData } from './useData';

export const Output: React.FC<
	Pick<BlockEditProps<TelegramLoginAtts>, 'attributes' | 'className'>
> = ({ attributes, className }) => {
	const assets = useData('assets');
	const { button_style, show_user_photo, corner_radius } = attributes;

	let button_width: string | undefined;
	if ('small' === button_style) {
		button_width = '100px';
	} else if ('medium' === button_style) {
		button_width = '150px';
	}

	let avatar_width: string | undefined;
	if ('small' === button_style) {
		avatar_width = '20px';
	} else if ('medium' === button_style) {
		avatar_width = '30px';
	}

	return (
		<div className={className}>
			<img
				src={assets.loginImageUrl}
				style={{ borderRadius: `${corner_radius}px`, width: button_width }}
				alt=""
			/>
			{show_user_photo ? (
				<img
					src={assets.loginAvatarUrl}
					style={{ width: avatar_width }}
					alt=""
				/>
			) : null}
		</div>
	);
};
