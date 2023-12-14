import { forwardRef } from 'react';
import { GroupBase } from 'react-select';
import ReactSelectAsync, { AsyncProps } from 'react-select/async';

import { components } from './components';

type Option = { label: string; value: string };

export type SelectAsyncProps = AsyncProps<Option, false, GroupBase<Option>>;

export const SelectAsync = forwardRef<ReactSelectAsync, SelectAsyncProps>(
	(props, ref) => {
		return (
			<ReactSelectAsync
				classNamePrefix="react-select"
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				components={components as any}
				{...props}
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				ref={ref as any}
			/>
		);
	},
) as React.FC<SelectAsyncProps>;
