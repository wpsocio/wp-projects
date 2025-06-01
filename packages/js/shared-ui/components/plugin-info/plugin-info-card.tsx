import { __, sprintf } from '@wpsocio/i18n';
import { useMediaQuery } from '@wpsocio/ui/hooks/useMediaQuery';
import { cn } from '@wpsocio/ui/lib/utils';
import { Accordion } from '@wpsocio/ui/wrappers/accordion';
import { Link } from '@wpsocio/ui/wrappers/link';
import { Description } from '../description.js';
import { Smile } from '../smile.js';
import { PluginInfoItem } from './plugin-info-item.js';

export interface PluginInfoCardProps {
	description?: string;
	title: string;
	pluginTitle: string;
	reviewLink?: string;
	socialIcons?: React.ReactNode;
	helpText?: string;
	supportLink?: string;
	supportLinkText?: string;
	upsell?: React.ReactNode;
	className?: string;
}

export const PluginInfoCard: React.FC<PluginInfoCardProps> = ({
	className,
	description,
	helpText,
	pluginTitle,
	reviewLink,
	socialIcons,
	supportLink,
	supportLinkText,
	title,
	upsell,
}) => {
	const isLargeScreen = useMediaQuery('(min-width: 768px)');

	return (
		<Accordion
			className={cn('border rounded-sm border-gray-200', className)}
			// Only open the accordion on large screens by default
			defaultOpen={isLargeScreen ? 'plugin-info' : undefined}
			items={[
				{
					value: 'plugin-info',
					trigger: title,
					className: 'px-4',
					wrapperClassName: 'border-b-0',
					content: () => (
						<div className="flex flex-col gap-4 items-center text-base">
							<PluginInfoItem>
								<Description>{description}</Description>
							</PluginInfoItem>
							{socialIcons && <PluginInfoItem>{socialIcons}</PluginInfoItem>}
							{reviewLink && (
								<PluginInfoItem className="text-center">
									<p className="mb-2">
										{sprintf(
											/* translators: %s: plugin name */
											__('Do you like %s?'),
											pluginTitle,
										)}
									</p>
									<div>
										<Link
											href={reviewLink}
											rel="noopener noreferrer"
											target="_blank"
											className="p-2"
										>
											<span
												aria-label={__('Write a review')}
												className="text-orange-300 text-2xl"
											>
												{'★★★★★'}
											</span>
										</Link>
									</div>
								</PluginInfoItem>
							)}
							{upsell && (
								<PluginInfoItem className="text-center">
									{upsell}
								</PluginInfoItem>
							)}
							<PluginInfoItem className="border-b-0 text-center">
								<div>
									<span>{__('Need help?')}</span>
								</div>
								{helpText && (
									<div>
										<span className="font-semibold">{helpText}</span>
									</div>
								)}
							</PluginInfoItem>

							{supportLink && (
								<PluginInfoItem className="p-0 border-b-0 w-full text-center">
									<Link
										className="block py-3 px-5 bg-blue-100 text-blue-800 font-bold italic"
										href={supportLink}
										target="_blank"
										rel="noopener noreferrer"
									>
										{supportLinkText || helpText}
									</Link>
								</PluginInfoItem>
							)}

							<PluginInfoItem className="border-b-0 py-0 text-center">
								<div>
									<Smile />
								</div>
							</PluginInfoItem>
						</div>
					),
				},
			]}
		/>
	);
};
