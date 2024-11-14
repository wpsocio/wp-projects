import { useBlockProps } from '@wordpress/block-editor';
import type { BlockEditProps } from '@wordpress/blocks';
import { Spinner } from '@wordpress/components';
import { useFocusableIframe, useMergeRefs } from '@wordpress/compose';
import { Fragment, useEffect, useRef, useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wpsocio/i18n';
import type { SinglePostAtts } from '../types';
import { Controls } from './Controls';
import { Placeholder } from './Placeholder';

const { message_view_url } = window.wptelegram_widget.assets;

export function Edit(props: BlockEditProps<SinglePostAtts>) {
	const [iframeState, setIframeState] = useState<'loading' | 'idle' | 'error'>(
		'loading',
	);
	const [isEditingURL, setIsEditingURL] = useState(false);
	const [url, setUrl] = useState(props.attributes.url || '');
	const [userpic, setUserpic] = useState<boolean>(
		props.attributes.userpic ?? true,
	);
	const [iframeHeight, setIframeHeight] = useState(0);

	const { alignment, iframe_src } = props.attributes;

	const label = __('Telegram post URL');

	function onChangeURL(event: React.ChangeEvent<HTMLInputElement>) {
		setUrl(event.target.value);
	}

	function updateUrl(event: React.FormEvent<HTMLFormElement>) {
		if (event) {
			event.preventDefault();
		}

		const regex =
			/^(?:https?:\/\/)?t\.me\/(?<username>[a-z][a-z0-9_]{3,30}[a-z0-9])\/(?<message_id>\d+)$/i;
		const match = url.match(regex);
		// validate URL
		if (null === match) {
			setIframeState('error');
		} else {
			const iframe_src = getIframeSrc(
				match.groups as {
					username: string;
					message_id: string;
				},
			);
			const { setAttributes } = props;

			setIframeState('loading');
			setIsEditingURL(false);
			setAttributes({ url, iframe_src });
		}
	}

	function getIframeSrc(data: { username: string; message_id: string }) {
		return message_view_url
			.replace('%username%', data.username)
			.replace('%message_id%', data.message_id)
			.replace('%userpic%', `${userpic}`);
	}

	function toggleUserPic(newValue: boolean) {
		setIframeState('loading');
		let { iframe_src } = props.attributes;
		iframe_src = addQueryArgs(iframe_src, { userpic: newValue });
		props.setAttributes({ userpic: newValue, iframe_src });

		setUserpic(newValue);
	}

	function onChangeAlign(align: SinglePostAtts['alignment']) {
		resizeIframe();
		props.setAttributes({ alignment: align });
	}
	const iframeRef = useRef<HTMLIFrameElement | null>();
	const ref = useMergeRefs([iframeRef, useFocusableIframe()]);

	function resizeIframe() {
		if (
			null === iframeRef?.current ||
			'undefined' === typeof iframeRef?.current?.contentWindow
		) {
			return;
		}
		const iframe_height =
			iframeRef?.current?.contentWindow?.document.body.scrollHeight;
		if (iframe_height !== iframeHeight) {
			setIframeHeight(iframe_height || 0);
		}
	}

	useEffect(() => {
		window.addEventListener('resize', resizeIframe);

		return () => {
			window.removeEventListener('resize', resizeIframe);
		};
	}, []);

	if (isEditingURL || !iframe_src) {
		return (
			<Placeholder
				label={label}
				error={iframeState === 'error'}
				url={url}
				onChangeURL={onChangeURL}
				onSubmit={updateUrl}
			/>
		);
	}

	const iframe_height = iframeState === 'loading' ? 0 : iframeHeight;

	return (
		<Fragment>
			<Controls
				userpic={userpic}
				toggleUserPic={toggleUserPic}
				showEditButton
				switchBackToURLInput={() => setIsEditingURL(true)}
				alignment={alignment}
				changeAlignment={onChangeAlign}
			/>
			{iframeState === 'loading' && (
				<div className="wp-block-embed is-loading">
					<Spinner />
					<p>{__('Loading…')}</p>
				</div>
			)}

			<div
				{...useBlockProps()}
				className={`${useBlockProps().className} wptelegram-widget-message`}
			>
				<div className={'wp-block-embed__content-wrapper'}>
					<iframe
						ref={ref}
						src={iframe_src}
						onLoad={() => {
							setIframeState('idle');
							resizeIframe();
						}}
						height={iframe_height}
						title={__('Telegram post')}
					>
						Your Browser Does Not Support iframes!
					</iframe>
				</div>
			</div>
		</Fragment>
	);
}
