import { useFormContext } from 'react-hook-form';
import { DebugData } from '@wpsocio/components';

export const FormDebug: React.FC<{ debug?: boolean }> = ({ debug = true }) => {
	const { watch } = useFormContext();

	return debug && <DebugData data={watch()} />;
};
