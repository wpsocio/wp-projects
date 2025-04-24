import type { BaseAssetsData, PluginInfo } from '@wpsocio/services/types.js';
import { Description } from '../description.js';
import { SectionCard, type SectionCardProps } from '../section-card.js';

export interface PluginHeaderProps
	extends PluginInfo,
		Omit<SectionCardProps, 'title'> {
	assets: BaseAssetsData;
	socialIcons?: React.ReactNode;
}

export const PluginHeader: React.FC<PluginHeaderProps> = ({
	assets,
	title,
	version,
	description,
	socialIcons,
	...sectionCardProps
}) => {
	return (
		<SectionCard
			title={
				<div className="flex items-center">
					{assets.logoUrl && (
						<img
							alt={title}
							src={assets.logoUrl}
							className="inline-block h-8 me-2 align-middle w-8"
						/>
					)}
					<div className="w-full flex items-baseline">
						<span className="text-xl font-semibold inline-block m-0 max-w-[80%] whitespace-nowrap overflow-hidden overflow-ellipsis line-h-[1.3]">
							{title}
						</span>
						<span className="text-sm text-gray-500 italic">
							&nbsp;v{version}
						</span>
					</div>
				</div>
			}
			{...sectionCardProps}
		>
			<Description>{description}</Description>
			{socialIcons}
		</SectionCard>
	);
};
