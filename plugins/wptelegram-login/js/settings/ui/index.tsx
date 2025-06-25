import './styles.scss';

import { setI18nData } from '@wpsocio/services/utils';
import { Toaster } from '@wpsocio/ui/components/sonner';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ROOT_ID } from '../constants';
import App from './App';

const root = document.getElementById(ROOT_ID);

window.__WPSOCIO_UI_ROOT_SELECTOR = `#${ROOT_ID}`;

setI18nData('wptelegram_login', 'wptelegram-login');

root
	? ReactDOM.createRoot(root).render(
			<React.StrictMode>
				<App />
				<Toaster />
			</React.StrictMode>,
		)
	: console.error(`Root element not found: ${ROOT_ID}`);
