export const Description: React.FC<React.HTMLAttributes<HTMLParagraphElement>> =
	({ children, ...props }) => {
		return (
			<p className="description" {...props}>
				{children}
			</p>
		);
	};
