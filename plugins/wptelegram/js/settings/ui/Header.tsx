import { PluginHeader } from '@wpsocio/shared-ui/components/plugin-info/plugin-header';
import { useData } from '../services/useData.js';

export const Header = () => {
	const { pluginInfo, assets } = useData();

	return <PluginHeader {...pluginInfo} assets={assets} />;
};
