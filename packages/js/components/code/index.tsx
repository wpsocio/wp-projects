export const Code: React.FC<React.HTMLAttributes<HTMLElement>> = ({
	children,
	...props
}) => {
	return <code {...props}>{children}</code>;
};
