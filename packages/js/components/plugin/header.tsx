import { Card, CardBody, CardHeader, Flex } from '@wordpress/components';
import { BaseAssetsData, PluginInfo } from '@wpsocio/helpers/types';
import { Description } from '../description';
import './styles.scss';

export interface PluginHeaderProps extends PluginInfo {
	assets?: BaseAssetsData;
	socialIcons?: React.ReactNode;
}

export const PluginHeader: React.FC<PluginHeaderProps> = ({
	assets,
	title,
	version,
	description,
	socialIcons,
}) => {
	return (
		<Card className="wpsocio-plugin-header">
			<CardHeader>
				{assets?.logoUrl ? (
					<img
						alt={title}
						className="wpsocio-plugin-header__logo"
						src={assets.logoUrl}
					/>
				) : null}
				<div className="wpsocio-plugin-header__title--wrap">
					<h1 className="wpsocio-plugin-header__title">{title}</h1>
					<span className="wpsocio-plugin-header__version">
						&nbsp;v{version}
					</span>
				</div>
			</CardHeader>
			<CardBody>
				<Description>{description}</Description>
				{socialIcons}
			</CardBody>
		</Card>
	);
};
