import type { CSSProperties } from 'react';

import { Box } from '@wpsocio/adapters';

type YouTubeVideoProps = {
	videoId: string;
	title: string;
	asGridCol?: boolean;
};

const parentStyle: CSSProperties = {
	position: 'relative',
	paddingBottom: '56.25%' /* 16:9 */,
	paddingTop: 25,
	height: 0,
};

const iframeStyle: CSSProperties = {
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
};

const gridColMS = { sm: '', md: 'auto' };

export const YouTubeVideo: React.FC<YouTubeVideoProps> = ({
	videoId,
	title,
	asGridCol,
}) => {
	const output = (
		<Box style={parentStyle}>
			<iframe
				title={title}
				style={iframeStyle}
				src={`https://www.youtube.com/embed/${videoId}`}
				frameBorder="0"
			/>
		</Box>
	);

	if (!asGridCol) {
		return output;
	}

	return (
		<Box maxWidth="380px" marginInlineStart={gridColMS}>
			{output}
		</Box>
	);
};
