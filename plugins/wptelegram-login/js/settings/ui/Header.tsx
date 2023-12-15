import { PluginHeader } from '@wpsocio/components';
import { useData } from '../services';

export const Header = () => {
	const { pluginInfo, assets } = useData();

	return <PluginHeader {...pluginInfo} assets={assets} />;
};
