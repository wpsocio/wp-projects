import { __experimentalDivider as Divider } from '@wordpress/components';
import { PluginHeader } from '@wpsocio/components/plugin';
import { Configuration } from './Configuration';
import { Instructions } from './Instructions';
import { ROOT_ID } from './constants';
import { usePluginData } from './hooks/usePluginData';

export const App: React.FC = () => {
	const { pluginInfo, assets } = usePluginData();

	return (
		<form id={`${ROOT_ID}-form`}>
			<div>
				<PluginHeader assets={assets} {...pluginInfo} />
				<Divider margin="4" />
				<Instructions />
				<Divider margin="4" />
				<Configuration />
			</div>
		</form>
	);
};
