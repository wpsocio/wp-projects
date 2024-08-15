import { __, sprintf } from '@wpsocio/i18n';
import { cn } from '@wpsocio/ui-components';
import { Link } from '@wpsocio/ui-components/wrappers/link.js';
import { Description } from '../description.js';
import { SectionCard } from '../section-card.js';
import { Smile } from '../smile.js';

const StackItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
	return (
		<div
			{...props}
			className={cn(
				'p-4 border-b border-gray-200 w-full text-center',
				props.className,
			)}
		/>
	);
};

export interface PluginInfoCardProps {
	description?: string;
	title: string;
	reviewLink?: string;
	socialIcons?: React.ReactNode;
	helpText?: string;
	supportLink?: string;
	supportLinkText?: string;
	upsell?: React.ReactNode;
}

export const PluginInfoCard: React.FC<PluginInfoCardProps> = ({
	description,
	helpText,
	reviewLink,
	socialIcons,
	supportLink,
	supportLinkText,
	title,
	upsell,
}) => {
	return (
		<SectionCard
			title={title}
			className="border border-gray-200"
			bodyClassName="px-0 py-0"
		>
			<div className="flex flex-col gap-4 items-center">
				<StackItem>
					<Description className="text-start">{description}</Description>
				</StackItem>
				{socialIcons && <StackItem>{socialIcons}</StackItem>}
				{reviewLink && (
					<StackItem>
						<p className="mb-2">
							{sprintf(
								/* translators: %s: plugin name */
								__('Do you like %s?'),
								title,
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
					</StackItem>
				)}
				{upsell && <StackItem>{upsell}</StackItem>}
				<StackItem className="border-b-0">
					<div>
						<span>{__('Need help?')}</span>
					</div>
					{helpText && (
						<div>
							<span className="font-semibold">{helpText}</span>
						</div>
					)}
				</StackItem>

				{supportLink && (
					<StackItem className="p-0 border-b-0 w-full">
						<Link
							className="block py-3 px-5 bg-blue-100 text-blue-800 font-bold italic"
							href={supportLink}
							target="_blank"
							rel="noopener noreferrer"
						>
							{supportLinkText || helpText}
						</Link>
					</StackItem>
				)}

				<StackItem>
					<div>
						<Smile />
					</div>
				</StackItem>
			</div>
		</SectionCard>
	);
};
