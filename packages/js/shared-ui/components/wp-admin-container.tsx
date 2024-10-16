export type WpAdminContainerProps = {
	children?: React.ReactNode;
	sidebar: React.ReactNode;
};

export function WpAdminContainer({ children, sidebar }: WpAdminContainerProps) {
	return (
		<>
			<style>
				{
					'#wpcontent { padding-left: 0 !important; padding-right: 0 !important; }'
				}
			</style>
			<div className="flex flex-col md:flex-row gap-4 p-3 sm:p-6">
				<div className="md:basis-2/3 xl:basis-3/4 shrink-0">{children}</div>
				<div className="md:basis-1/3 xl:basis-1/4">{sidebar}</div>
			</div>
		</>
	);
}
