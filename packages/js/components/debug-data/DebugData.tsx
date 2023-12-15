import type { CSSProperties } from 'react';

import { isDev } from '@wpsocio/utilities';

import { Collapse } from '../collapse';

const style: CSSProperties = {
	borderRadius: '5px',
	boxSizing: 'border-box',
	padding: '1em 2em',
	color: '#a9ce47',
	backgroundColor: '#26203d',
	whiteSpace: 'pre-wrap',
};

export interface DebugDataProps {
	data: unknown;
	asJson?: boolean;
	asCollapse?: boolean;
}

export const DebugData: React.FC<DebugDataProps> = ({
	data,
	asJson = true,
	asCollapse = true,
}) => {
	if (!isDev) {
		return null;
	}

	let dataToRender = '';

	// data may not be serializable
	try {
		dataToRender = asJson ? JSON.stringify(data, null, 2) : `${data}`;
	} catch (error) {
		// console.error((error as Error).message);
		console.log('ERROR', data);
	}

	const output = <pre style={style}>{dataToRender}</pre>;

	if (!asCollapse) {
		return output;
	}

	return <Collapse title={'Debug Data'}>{output}</Collapse>;
};
