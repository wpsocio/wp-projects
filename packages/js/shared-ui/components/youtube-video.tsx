import type { CSSProperties } from 'react';

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

export const YouTubeVideo: React.FC<YouTubeVideoProps> = ({
	videoId,
	title,
	asGridCol,
}) => {
	const output = (
		<div style={parentStyle}>
			<iframe
				title={title}
				style={iframeStyle}
				src={`https://www.youtube.com/embed/${videoId}`}
			/>
		</div>
	);

	if (!asGridCol) {
		return output;
	}

	return <div className="max-w-[380px]">{output}</div>;
};
