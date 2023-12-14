import { forwardRef } from 'react';
import { Link as ChakraLink, LinkProps as ChakraLinkProps } from '@chakra-ui/react';

export const Link = forwardRef<HTMLAnchorElement, ChakraLinkProps>((props, ref) => {
	return <ChakraLink ref={ref} color='#0073aa' isExternal {...props} />;
});
