import { cleanupAdminScreen } from '@wpsocio/helpers/wp-admin';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import { ROOT_ID } from './constants';
import './styles.scss';

// clea up notifications etc.
cleanupAdminScreen(ROOT_ID);

const root = document.getElementById(ROOT_ID);

root
	? ReactDOM.createRoot(root).render(
			<React.StrictMode>
				<App />
			</React.StrictMode>,
	  )
	: console.error(`Root element not found: ${ROOT_ID}`);
