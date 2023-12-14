import { useCallback, useRef } from 'react';

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogCloseButton,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	ButtonProps,
	useDisclosure,
} from '@wpsocio/adapters';
import { __ } from '@wpsocio/i18n';

export interface ConfirmDialogProps {
	body: string;
	cancelText?: string;
	confirmText?: string;
	onConfirm?: VoidFunction;
	title: string;
	triggerProps: ButtonProps;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	body,
	cancelText,
	confirmText,
	onConfirm,
	title,
	triggerProps,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef(null);

	const onClickConfirm = useCallback(() => {
		onClose();
		onConfirm?.();
	}, [onClose, onConfirm]);

	return (
		<>
			<Button {...triggerProps} onClick={onOpen} />
			<AlertDialog
				leastDestructiveRef={cancelRef}
				onClose={onClose}
				isOpen={isOpen}
				isCentered
			>
				<AlertDialogOverlay />
				<AlertDialogContent>
					<AlertDialogHeader>{title}</AlertDialogHeader>
					<AlertDialogCloseButton />
					<AlertDialogBody>{body}</AlertDialogBody>
					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={onClose}>
							{cancelText || __('No')}
						</Button>
						<Button ml={3} onClick={onClickConfirm} colorScheme="blue">
							{confirmText || __('Yes')}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};
