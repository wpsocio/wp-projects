import ReactDOM from 'react-dom';

import { ThemeProvider } from '@wpsocio/adapters';
import { cleanup, setI18nData } from '@wpsocio/services';

import { ROOT_ID } from '../constants';
import App from './App';

const root = document.getElementById(ROOT_ID);

const ThemedApp: React.FC = () => (
	<ThemeProvider>
		<App />
	</ThemeProvider>
);

// clea up notifications etc.
cleanup(ROOT_ID);

setI18nData('wptelegram', 'wptelegram');

ReactDOM.render(<ThemedApp />, root);
