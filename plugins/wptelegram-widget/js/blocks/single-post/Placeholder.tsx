import { Button, Placeholder as WPPlaceholder } from '@wordpress/components';

import { __ } from '@wpsocio/i18n';

const errorStyle: React.CSSProperties = { border: '2px solid #f71717' };

type PlaceholderProps = {
	error?: boolean;
	label: string;
	onChangeURL: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	url: string;
};

export const Placeholder: React.FC<PlaceholderProps> = ({
	error,
	label,
	onChangeURL,
	onSubmit,
	url,
}) => {
	const style = error ? errorStyle : undefined;

	return (
		<WPPlaceholder
			icon="wordpress-alt"
			label={label}
			className="wp-block-embed-telegram"
		>
			<form onSubmit={onSubmit}>
				<input
					aria-label={label}
					className="components-placeholder__input"
					onChange={onChangeURL}
					placeholder="https://t.me/WPTelegram/102"
					style={style}
					type="url"
					value={url || ''}
				/>
				<Button type="submit">{__('Embed')}</Button>
			</form>
		</WPPlaceholder>
	);
};
