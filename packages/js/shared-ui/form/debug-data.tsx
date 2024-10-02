import { isDev } from '@wpsocio/utilities/constants.js';

import { Accordion } from '@wpsocio/ui-components/wrappers/accordion.js';

const style: React.CSSProperties = {
	borderRadius: '5px',
	boxSizing: 'border-box',
	padding: '1em 2em',
	color: '#a9ce47',
	backgroundColor: '#26203d',
	whiteSpace: 'pre-wrap',
	overflowWrap: 'anywhere',
};

export interface DebugDataProps {
	data: unknown;
	asJson?: boolean;
}

export const DebugData: React.FC<DebugDataProps> = ({
	data,
	asJson = true,
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

	return (
		<Accordion
			items={[
				{
					value: 'data',
					trigger: 'Debug Data',
					content: () => <pre style={style}>{dataToRender}</pre>,
				},
			]}
		/>
	);
};