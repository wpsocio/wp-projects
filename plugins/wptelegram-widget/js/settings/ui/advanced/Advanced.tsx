import { Link } from '@wpsocio/adapters';
import { type FieldConditions, FormField } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';

import { getFieldLabel } from '../../services';

const prefix = 'advanced';

const scriptUrlConditions: FieldConditions = [
	{
		field: `${prefix}.telegram_blocked`,
		value: true,
		compare: '=',
	},
];

export const Advanced: React.FC = () => {
	return (
		<>
			<FormField
				name={`${prefix}.telegram_blocked`}
				label={getFieldLabel('telegram_blocked')}
				fieldType="switch"
				description={__('Whether your host blocks Telegram.')}
			/>
			<FormField
				name={`${prefix}.google_script_url`}
				label={getFieldLabel('google_script_url')}
				fieldType="text"
				description={__(
					'The requests to Telegram will be sent via your Google Script.',
				)}
				after={
					<small>
						<Link
							href="https://gist.github.com/manzoorwanijk/7b1786ad69826d1a7acf20b8be83c5aa#how-to-deploy"
							isExternal
						>
							{__('See this tutorial')}
						</Link>
					</small>
				}
				conditions={scriptUrlConditions}
			/>
		</>
	);
};
