import { PropsWithChildren, useEffect, useState } from 'react';

import type { BaseDOMData } from './types';

export interface WithDOMDataProps<Data extends BaseDOMData> {
	data: Data;
	plugin: string;
}

export const WithDOMData = <Data extends BaseDOMData>({
	children,
	data,
	plugin,
}: PropsWithChildren<WithDOMDataProps<Data>>): React.ReactNode => {
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
