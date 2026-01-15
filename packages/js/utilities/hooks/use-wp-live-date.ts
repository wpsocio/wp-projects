import { date } from '@wordpress/date';
import { useEffect, useMemo, useState } from 'react';

// "July 23, 2025 10:19:45 am"
const defaultFormat = 'F j, Y g:i:s a';

export function useWpLiveDate(dateFormat = defaultFormat) {
	const [key, setKey] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => setKey((prev) => prev + 1), 1000);

		return () => clearInterval(interval);
	}, []);

	return useMemo(() => {
		// This is to force re-render when key changes
		// And to avoid lint warnings about dependency not used
		key.toString();

		return date(dateFormat, undefined, undefined);
	}, [key, dateFormat]);
}
