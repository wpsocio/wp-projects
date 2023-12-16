import { botApi } from '@wpsocio/services';
import { useEffect } from 'react';
import { useData } from './useData';

export const useInit = () => {
	const { api } = useData();

	useEffect(() => {
		botApi.setApiData(api);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return;
};
