import { Button } from '@wordpress/components';
import { TelegramIcon } from './TelegramIcon';

export type JoinButtonProps = {
	link: string;
	text: string;
	isEditing?: boolean;
};

export const JoinButton: React.FC<JoinButtonProps> = ({
	link,
	text,
	isEditing,
}) => {
	return (
		<Button
			href={link}
			className="join-link"
			icon={<TelegramIcon />}
			target={isEditing ? '_blank' : undefined}
			rel="noopener noreferrer"
		>
			{text}
		</Button>
	);
};
