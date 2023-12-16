import type { BlockEditProps } from '@wordpress/blocks';
import { FocusableIframe, Spinner } from '@wordpress/components';
import { Component, Fragment, createRef } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wpsocio/i18n';
import type { SinglePostAtts } from '../types';
import { Controls } from './Controls';
import { Placeholder } from './Placeholder';

const { message_view_url } = window.wptelegram_widget.assets;

type State = {
	loading: boolean;
	editingURL: boolean;
	error: boolean;
	url: string;
	userpic: boolean;
	iframe_height?: number;
};

export class Edit extends Component<BlockEditProps<SinglePostAtts>, State> {
	iframe_ref: React.RefObject<HTMLIFrameElement>;

	constructor(props: BlockEditProps<SinglePostAtts>) {
		super(props);
		this.iframe_ref = createRef<HTMLIFrameElement>();

		this.switchBackToURLInput = this.switchBackToURLInput.bind(this);
		this.getIframeSrc = this.getIframeSrc.bind(this);
		this.toggleUserPic = this.toggleUserPic.bind(this);
		this.resizeIframe = this.resizeIframe.bind(this);
		this.setUrl = this.setUrl.bind(this);
		this.handleOnChangeURL = this.handleOnChangeURL.bind(this);
		this.handleOnChangeAlign = this.handleOnChangeAlign.bind(this);
		this.onLoad = this.onLoad.bind(this);

		this.state = {
			loading: true,
			editingURL: false,
			error: false,
			url: this.props.attributes.url || '',
			userpic: this.props.attributes.userpic || true,
			iframe_height: 0,
		};
	}

	toggleUserPic() {
		const userpic = !this.state.userpic;
		const loading = true;
		let { iframe_src } = this.props.attributes;

		iframe_src = addQueryArgs(iframe_src, { userpic });

		this.setState({ userpic, loading });
		this.props.setAttributes({ userpic, iframe_src });
	}

	setUrl(event: React.FormEvent<HTMLFormElement>) {
		if (event) {
			event.preventDefault();
		}
		const { url } = this.state;

		const regex =
			/^(?:https?:\/\/)?t\.me\/(?<username>[a-z][a-z0-9_]{3,30}[a-z0-9])\/(?<message_id>\d+)$/i;
		const match = url.match(regex);
		// validate URL
		if (null === match) {
			this.setState({ error: true });
		} else {
			const iframe_src = this.getIframeSrc(
				match.groups as {
					username: string;
					message_id: string;
				},
			);
			const { setAttributes } = this.props;

			this.setState({ loading: true, editingURL: false, error: false });
			setAttributes({ url, iframe_src });
		}
	}

	getIframeSrc(data: { username: string; message_id: string }) {
		return message_view_url
			.replace('%username%', data.username)
			.replace('%message_id%', data.message_id)
			.replace('%userpic%', `${this.state.userpic}`);
	}

	switchBackToURLInput() {
		this.setState({ editingURL: true });
	}

	componentDidMount() {
		window.addEventListener('resize', this.resizeIframe);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeIframe);
	}

	resizeIframe() {
		if (
			null === this.iframe_ref?.current ||
			'undefined' === typeof this.iframe_ref.current.contentWindow
		) {
			return;
		}
		const iframe_height =
			this.iframe_ref?.current?.contentWindow?.document.body.scrollHeight;
		if (iframe_height !== this.state.iframe_height) {
			this.setState({ iframe_height });
		}
	}

	handleOnChangeURL(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({ url: event.target.value });
	}

	handleOnChangeAlign(align: SinglePostAtts['alignment']) {
		this.resizeIframe();
		this.props.setAttributes({ alignment: align });
	}

	onLoad() {
		this.setState({ loading: false });
		this.resizeIframe();
	}

	render() {
		const { loading, editingURL, url, error, userpic } = this.state;
		const { className } = this.props;
		const { alignment, iframe_src } = this.props.attributes;

		const label = __('Telegram post URL');

		if (editingURL || !iframe_src) {
			return (
				<Placeholder
					label={label}
					error={error}
					url={url}
					onChangeURL={this.handleOnChangeURL}
					onSubmit={this.setUrl}
				/>
			);
		}

		const iframe_height = loading ? 0 : this.state.iframe_height;

		return (
			<Fragment>
				<Controls
					userpic={userpic}
					toggleUserPic={this.toggleUserPic}
					showEditButton
					switchBackToURLInput={this.switchBackToURLInput}
					alignment={alignment}
					changeAlignment={this.handleOnChangeAlign}
				/>
				{loading && (
					<div className="wp-block-embed is-loading">
						<Spinner />
						<p>{__('Loading…')}</p>
					</div>
				)}

				<div className={`${className} wptelegram-widget-message`}>
					<div className={'wp-block-embed__content-wrapper'}>
						<FocusableIframe
							iframeRef={this.iframe_ref}
							frameBorder="0"
							scrolling="no"
							src={iframe_src}
							onLoad={this.onLoad}
							height={iframe_height}
						>
							Your Browser Does Not Support iframes!
						</FocusableIframe>
					</div>
				</div>
			</Fragment>
		);
	}
}
