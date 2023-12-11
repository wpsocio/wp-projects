import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.scss';

const rootId = 'wp-test-plugin-login';

const root = document.getElementById(rootId);

root
	? ReactDOM.createRoot(root).render(
			<React.StrictMode>
				<App />
			</React.StrictMode>,
	  )
	: console.error(`Root element not found: ${rootId}`);
