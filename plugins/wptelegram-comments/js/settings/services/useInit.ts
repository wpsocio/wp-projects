import botApi from '@wpsocio/services/telegram/telegram-api.js';
import { useEffect } from 'react';
import { useData } from './useData';

export const useInit = () => {
	const { api } = useData();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		botApi.setApiData(api || {});
	}, []);

	return;
};
