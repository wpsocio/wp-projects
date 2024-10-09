import { DebugData } from './debug-data.js';

export const FormDebug: React.FC<{ debug?: boolean; data: unknown }> = ({
	debug = true,
	data,
}) => {
	return debug && <DebugData data={data} />;
};
