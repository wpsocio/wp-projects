import './styles.scss';

import { cleanup, setI18nData } from '@wpsocio/services';
import { Toaster } from '@wpsocio/ui-components/ui/toaster';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ROOT_ID } from '../constants';
import App from './App';

const root = document.getElementById(ROOT_ID);

// clea up notifications etc.
cleanup(ROOT_ID);

window.__WPSOCIO_UI_ROOT_SELECTOR = `#${ROOT_ID}`;

setI18nData('wptelegram', 'wptelegram');

root
	? ReactDOM.createRoot(root).render(
			<React.StrictMode>
				<App />
				<Toaster />
			</React.StrictMode>,
		)
	: console.error(`Root element not found: ${ROOT_ID}`);
