import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import './styles.scss';

const theme = extendTheme({ direction: document.documentElement.dir });

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	return (
		<ChakraProvider theme={theme} resetCSS>
			{children}
		</ChakraProvider>
	);
};
