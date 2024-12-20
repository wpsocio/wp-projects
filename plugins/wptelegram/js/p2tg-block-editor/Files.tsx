import { BaseControl, Button, Flex, Icon } from '@wordpress/components';
import { useCallback, useState } from '@wordpress/element';
import { MediaUpload } from '@wordpress/media-utils';

import { __ } from '@wpsocio/i18n';

import { useDataState, useUpdateField } from './data';

const render: React.FC<{ open: VoidFunction }> = ({ open }) => (
	<Button variant="secondary" onClick={open} id="wptg-upload-media">
		{__('Add or Upload Files')}
	</Button>
);

const allowedTypes: Array<string> = [];

type FileInfo = { id: number; url: string; filesizeHumanReadable?: string };

export function Files() {
	const { data } = useDataState();
	const updateField = useUpdateField();

	const onRemove = useCallback(
		(id: string) => () => {
			const { [id]: _, ...files } = data.files || {};
			updateField('files')(files);
		},
		[data.files, updateField],
	);

	const [filesizeMap, setFilesizeMap] = useState<Record<string, string>>({});

	const onSelect = useCallback(
		(files: Array<FileInfo>) => {
			const newFiles = files.reduce(
				(acc, { id, url, filesizeHumanReadable }) => {
					if (filesizeHumanReadable) {
						setFilesizeMap((prev) => ({
							...prev,
							[id]: filesizeHumanReadable,
						}));
					}
					acc[id] = url;
					return acc;
				},
				{} as Record<string, string>,
			);
			updateField('files')(newFiles);
		},
		[updateField],
	);

	return (
		<BaseControl
			id="wptg-files"
			label={__('Files')}
			help={__('Files to be sent after the message.')}
			__nextHasNoMarginBottom
		>
			<MediaUpload
				multiple
				onSelect={onSelect}
				allowedTypes={allowedTypes}
				render={render}
			/>
			<fieldset>
				<ul id="wptg-files" aria-label={__('Files')}>
					{Object.entries(data.files || {}).map(([id, url], index) => {
						const urlParts = url.split('/');
						const name = urlParts[urlParts.length - 1];
						return (
							<li
								// biome-ignore lint/suspicious/noArrayIndexKey: it's fine
								key={id + index}
							>
								<Flex justify="flex-start">
									<Button
										icon={<Icon icon="no-alt" />}
										onClick={onRemove(id)}
									/>
									<span>{name}</span>
									{filesizeMap[id] ? <span>({filesizeMap[id]})</span> : null}
								</Flex>
							</li>
						);
					})}
				</ul>
			</fieldset>
		</BaseControl>
	);
}
