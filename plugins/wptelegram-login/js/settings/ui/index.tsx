import '../../shared-styles.scss';

import { cleanup, setI18nData } from '@wpsocio/services';
import { Toaster } from '@wpsocio/ui-components/ui/toaster';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ROOT_ID } from '../constants';
import App from './App';

const root = document.getElementById(ROOT_ID);

// clea up notifications etc.
cleanup(ROOT_ID);

setI18nData('wptelegram_login', 'wptelegram-login');

root
	? ReactDOM.createRoot(root).render(
			<React.StrictMode>
				<App />
				<Toaster />
			</React.StrictMode>,
		)
	: console.error(`Root element not found: ${ROOT_ID}`);
