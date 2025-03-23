import { useFormContext, useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { FormField } from '@wpsocio/shared-ui/form/form-field';
import { FormItem } from '@wpsocio/shared-ui/form/form-item';
import { Textarea } from '@wpsocio/ui/components/textarea';
import { FormControl } from '@wpsocio/ui/wrappers/form';
import $ from 'jquery';
import { useEffect } from 'react';

import { type DataShape, getFieldLabel } from '../services';

export const Code: React.FC = () => {
	const { setValue } = useFormContext<DataShape>();

	const code = useWatch({ name: 'code', defaultValue: '' });

	useEffect(() => {
		let attributesJSON = '';
		if (code) {
			try {
				const el = $(code.trim());
				if (el.length && 'SCRIPT' === el[0].nodeName) {
					const attributes: Record<string, string> = {};
					$.each(el[0].attributes, (_, attr) => {
						attributes[attr.name] = attr.value;
					});

					attributesJSON = JSON.stringify(attributes);
				}
			} catch (error) {
				console.error('CODE ERROR', error);
			}
		}
		setValue('attributes', attributesJSON);
	}, [code, setValue]);

	return (
		<>
			<FormField
				name="code"
				render={({ field }) => (
					<FormItem
						label={getFieldLabel('code')}
						description={__('Please read the instructions above.')}
						isRequired
					>
						<FormControl>
							<Textarea
								className="appearance-none bg-gray-100 font-mono text-xs py-2 resize-none text-left whitespace-pre-wrap break-words"
								required
								spellCheck={false}
								{...field}
							/>
						</FormControl>
					</FormItem>
				)}
			/>

			<FormField
				name="attributes"
				render={({ field }) => (
					<FormControl>
						<input type="hidden" {...field} />
					</FormControl>
				)}
			/>
		</>
	);
};
