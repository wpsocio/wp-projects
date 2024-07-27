import {
	Button,
	type ButtonProps,
	Modal as ChakraModal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/react';

export interface ModalProps extends React.ComponentProps<typeof ChakraModal> {
	bodyClassName?: string;
	cancelButtonProps?: ButtonProps;
	className?: string;
	closeButton?: React.ReactNode;
	content?: React.ReactNode;
	destroyOnClose?: boolean;
	footerContent?: React.ReactNode;
	isClosable?: boolean;
	submitButtonProps?: ButtonProps;
	title?: React.ReactNode;
	withBorder?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
	bodyClassName,
	cancelButtonProps,
	children,
	className,
	closeButton,
	content,
	destroyOnClose = true,
	footerContent,
	isClosable = true,
	isOpen,
	submitButtonProps,
	title,
	...props
}) => {
	if (destroyOnClose && !isOpen) {
		return null;
	}

	const cancelButton = cancelButtonProps && (
		<Button mr={3} {...cancelButtonProps} />
	);
	const submitButton = submitButtonProps && (
		<Button variantColor="blue" {...submitButtonProps} />
	);
	const defaultFooterNode = (cancelButton || submitButton) && (
		<>
			{cancelButton}
			{submitButton}
		</>
	);

	const footerNode = footerContent ? (
		<>
			{cancelButton && cancelButton}
			{footerContent}
		</>
	) : (
		defaultFooterNode
	);

	return (
		<ChakraModal
			closeOnOverlayClick={isClosable}
			isCentered
			isOpen={isOpen}
			{...props}
		>
			<ModalOverlay>
				<ModalContent role="alertdialog" className={className}>
					<ModalHeader>{title}</ModalHeader>

					{closeButton ? (
						closeButton
					) : (
						<ModalCloseButton isDisabled={!isClosable} />
					)}

					<ModalBody className={bodyClassName}>{children || content}</ModalBody>

					{footerNode && <ModalFooter>{footerNode}</ModalFooter>}
				</ModalContent>
			</ModalOverlay>
		</ChakraModal>
	);
};
