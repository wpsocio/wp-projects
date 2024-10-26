import { PluginHeader } from '@wpsocio/shared-ui/components/plugin-info/plugin-header';
import { getDomData } from '../services/getDomData.js';

const { pluginInfo, assets } = getDomData();

export const Header = () => {
	return <PluginHeader {...pluginInfo} assets={assets} />;
};
