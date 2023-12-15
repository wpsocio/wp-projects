import { forwardRef } from 'react';
import ReactSelect, { Props } from 'react-select';

type Option = { label: string; value: string };

export type MultiSelectProps = Props<Option, true>;

export const MultiSelect = forwardRef<ReactSelect, MultiSelectProps>(
	(props, ref) => {
		return (
			<ReactSelect
				classNamePrefix="react-select"
				isMulti
				{...props}
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				ref={ref as any}
			/>
		);
	},
) as React.FC<MultiSelectProps>;
