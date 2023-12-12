import { TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import $ from 'jquery';
import { usePluginData } from './hooks/usePluginData';

export const CodeField: React.FC = () => {
	const { savedSettings } = usePluginData();

	const onChange = (code: string) => {
		let attributesJSON = '';
		if (code) {
			try {
				const el = $(code.trim());
				if (el.length && 'SCRIPT' === el[0].nodeName) {
					const attributes: Record<string, string> = {};
					$.each(el[0].attributes, (i, attr) => {
						attributes[attr.name] = attr.value;
					});

					attributesJSON = JSON.stringify(attributes);
				}
			} catch (error) {
				console.error('CODE ERROR', error);
			}
		}
		console.log('attributesJSON', attributesJSON);

		// update attributes hidden input
		$('input[name="attributes"]').val(attributesJSON);
	};
	return (
		<>
			<input type="hidden" name="attributes" value={savedSettings.attributes} />
			<TextareaControl
				name="code"
				label={__('Code')}
				onChange={onChange}
				// @ts-expect-error
				value={undefined}
				defaultValue={savedSettings.code}
			/>
		</>
	);
};
