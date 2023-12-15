import { useCallback, useMemo } from 'react';

import type { Plugins } from './types';
import { useLocalStorage } from './useLocalStorage';

export interface ActiveTab {
	getActiveTab: (defaultValue: number) => number;
	setActiveTab: (newTab: number) => void;
}

const DEFAULT_KEY = 'mainActiveTab';

export const useActiveTab = (
	plugin: keyof Plugins,
	tabKey = DEFAULT_KEY,
): ActiveTab => {
	const { getItem, setItem } = useLocalStorage(plugin, {});

	const getActiveTab = useCallback<ActiveTab['getActiveTab']>(
		(defaultValue) => getItem(tabKey, defaultValue),
		[getItem, tabKey],
	);

	const setActiveTab = useCallback<ActiveTab['setActiveTab']>(
		(newTab) => setItem(tabKey, newTab),
		[setItem, tabKey],
	);

	return useMemo(
		() => ({
			getActiveTab,
			setActiveTab,
		}),
		[getActiveTab, setActiveTab],
	);
};
