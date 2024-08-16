import { useFormContext, useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { FormItem } from '@wpsocio/shared-ui/form/form-item';
import { Textarea } from '@wpsocio/ui-components/ui/textarea.js';
import {
	FormControl,
	FormField,
} from '@wpsocio/ui-components/wrappers/form.js';
import $ from 'jquery';
import { useEffect } from 'react';

import { type DataShape, getFieldLabel } from '../services';

export const Code: React.FC = () => {
	const { setValue, control } = useFormContext<DataShape>();

	const code = useWatch({ name: 'code', defaultValue: '' });

	useEffect(() => {
		let attributesJSON = '';
		if (code) {
			try {
				const el = $(code.trim());
				if (el.length && 'SCRIPT' === el[0].nodeName) {
					const attributes: Record<string, string> = {};
					$.each(el[0].attributes, (i, attr) => {
						attributes[attr.name] = attr.value;
					});

					console.log(attributes);

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
				control={control}
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
				control={control}
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
