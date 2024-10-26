import botApi from '@wpsocio/services/telegram/telegram-api.js';
import { useEffect } from 'react';
import { getDomData } from './getDomData';

export const useInit = () => {
	useEffect(() => {
		const { api } = getDomData();
		botApi.setApiData(api);
	}, []);

	return;
};
