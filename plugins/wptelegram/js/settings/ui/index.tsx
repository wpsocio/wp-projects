import ReactDOM from 'react-dom/client';

import { ThemeProvider } from '@wpsocio/adapters';
import { cleanup, setI18nData } from '@wpsocio/services';

import React from 'react';
import { ROOT_ID } from '../constants';
import App from './App';

const root = document.getElementById(ROOT_ID);

// clea up notifications etc.
cleanup(ROOT_ID);

setI18nData('wptelegram', 'wptelegram');

root
	? ReactDOM.createRoot(root).render(
			<React.StrictMode>
				<ThemeProvider>
					<App />
				</ThemeProvider>
			</React.StrictMode>,
	  )
	: console.error(`Root element not found: ${ROOT_ID}`);
