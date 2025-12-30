import './styles.scss';

import { cleanup, setI18nData } from '@wpsocio/services/utils';
import { Toaster } from '@wpsocio/ui/components/sonner';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ROOT_ID } from '../constants';
import App from './App';

const root = document.getElementById(ROOT_ID);

// clean up notifications etc.
cleanup(ROOT_ID, { disableCommonCSS: true });

setI18nData('wptelegram_widget', 'wptelegram-widget');

root
	? ReactDOM.createRoot(root).render(
			<React.StrictMode>
				<App />
				<Toaster />
			</React.StrictMode>,
		)
	: // biome-ignore lint/suspicious/noConsole: Console error is fine here
		console.error(`Root element not found: ${ROOT_ID}`);
