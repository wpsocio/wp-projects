import {
	Link as ChakraLink,
	type LinkProps as ChakraLinkProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Link = forwardRef<HTMLAnchorElement, ChakraLinkProps>(
	(props, ref) => {
		return <ChakraLink ref={ref} color="#0073aa" isExternal {...props} />;
	},
);
