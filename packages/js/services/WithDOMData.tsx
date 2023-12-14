import { PropsWithChildren, useEffect, useState } from 'react';

import type { BaseDOMData, Plugins } from './types';

export interface WithDOMDataProps<Data extends BaseDOMData> {
	data: Data;
	plugin: keyof Plugins;
}

export const WithDOMData = <Data extends BaseDOMData>({
	children,
	data,
	plugin,
}: PropsWithChildren<WithDOMDataProps<Data>>): JSX.Element => {
	const [isDataSet, setIsDataSet] = useState(false);
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		window[plugin] = data;
		setIsDataSet(true);

		return () => {
			delete window[plugin];
		};
	}, []);

	return <>{isDataSet ? children : null}</>;
};
