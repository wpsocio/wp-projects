import $ from 'jquery';
import React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';

declare global {
	interface Window {
		WPSocioIframedWPAdmin: {
			assets: {
				styles: string;
				scripts: string;
			};
			props: React.HTMLAttributes<HTMLIFrameElement>;
			config?: {
				removeRootSiblings?: boolean;
			};
		};
	}
}
const { assets, props, config } = window.WPSocioIframedWPAdmin;

const rootId = 'wpsocio-iframed-wp-admin-root';

function App({
	tabIndex = 0,
	...props
}: React.HTMLAttributes<HTMLIFrameElement>) {
	const html = `<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <base href="${window.location.origin}">
        <style>
            html {
                height: 100% !important;
                overflow: hidden;
            }
        </style>
        ${assets.styles}
        ${assets.scripts}
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>`;

	const [src, cleanup] = useMemo(() => {
		const url = URL.createObjectURL(
			new window.Blob([html], { type: 'text/html' }),
		);
		return [url, () => URL.revokeObjectURL(url)];
	}, [html]);
	const [iframeDocument, setIframeDocument] = useState<Document | null>();
	useEffect(() => cleanup, [cleanup]);
	const [height, setHeight] = useState<number>(0);
	const iframeRef = useRef<HTMLIFrameElement | null>(null);

	useEffect(() => {
		if (!iframeDocument) return;

		const resizeObserver = new ResizeObserver(() => {
			setHeight(iframeDocument.body.scrollHeight);
		});

		resizeObserver.observe(iframeDocument.body);

		return () => resizeObserver.disconnect();
	}, [iframeDocument]);

	return (
		<div style={{ height: `${height}px` }}>
			<style>
				{
					'#wpcontent { padding-left: 0 !important; padding-right: 0 !important; }'
				}
				{'body, #wpbody { background: #fff; }'}
			</style>
			<iframe
				{...props}
				style={{
					...props.style,
					height: props.style?.height || '100%',
					width: props.style?.width || '100%',
					border: 0,
				}}
				onLoad={() => {
					const doc = iframeRef.current?.contentDocument;
					if (!doc) return;

					setIframeDocument(doc);

					// Delay to allow full render
					setTimeout(() => {
						const newHeight = doc.body?.scrollHeight || 0;
						setHeight(newHeight);
					}, 50);
				}}
				ref={iframeRef}
				tabIndex={tabIndex}
				src={src}
			/>
		</div>
	);
}

const root = document.getElementById(rootId);

if (root) {
	ReactDOM.createRoot(root).render(
		<React.StrictMode>
			<App {...props} />
		</React.StrictMode>,
	);

	if (false !== config?.removeRootSiblings) {
		// Remove root siblings if the option is set
		$(root).siblings().remove();
	}
} else {
	console.error(`Root element not found: ${rootId}`);
}
