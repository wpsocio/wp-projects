import type { Props } from 'react-select';
import { Spinner } from '@chakra-ui/react';

export type MultiSelectAsyncProps = Props<
	{ label: string; value: string },
	true
>;

export const components: MultiSelectAsyncProps['components'] = {
	LoadingIndicator: () => (
		<Spinner color="blue.500" size="sm" marginInlineEnd="5px" />
	),
};
