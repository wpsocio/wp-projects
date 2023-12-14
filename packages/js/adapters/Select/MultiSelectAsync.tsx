import { forwardRef } from 'react';
import { GroupBase } from 'react-select';
import ReactSelectAsync, { AsyncProps } from 'react-select/async';

import { components } from './components';

type Option = { label: string; value: string };

export type MultiSelectAsyncProps = AsyncProps<Option, true, GroupBase<Option>>;

export const MultiSelectAsync = forwardRef<
	ReactSelectAsync,
	MultiSelectAsyncProps
>((props, ref) => {
	return (
		<ReactSelectAsync
			classNamePrefix="react-select"
			components={components}
			isMulti
			{...props}
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			ref={ref as any}
		/>
	);
}) as React.FC<MultiSelectAsyncProps>;
