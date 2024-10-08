import type { AnyObject } from '@wpsocio/utilities/types';
import { useCallback, useMemo } from 'react';

interface LocalStorage<D extends AnyObject> {
	getData: () => D;
	setData: (data: D) => void;
	getItem: <T>(itemKey: string, defaultValue?: T) => T;
	setItem: <T>(itemKey: string, value: T) => void;
}

export const useLocalStorage = <D extends AnyObject>(
	storageKey: string,
	initialValue?: D,
	storage: Storage = localStorage,
): LocalStorage<D> => {
	const getData = useCallback<LocalStorage<D>['getData']>(() => {
		let result: string;
		try {
			result = storage?.getItem(storageKey) ?? '';
		} catch (e) {
			return {};
		}
		return result ? JSON.parse(result) : initialValue;
	}, [initialValue, storage, storageKey]);

	const setData = useCallback<LocalStorage<D>['setData']>(
		(data) => {
			try {
				storage.setItem(storageKey, JSON.stringify(data));
			} catch (e) {
				// koi baat nahin ^_^
			}
		},
		[storage, storageKey],
	);

	const getItem = useCallback<LocalStorage<D>['getItem']>(
		(itemKey, defaultValue) => {
			const value = getData()?.[itemKey];

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			return (value ?? defaultValue) as any;
		},
		[getData],
	);

	const setItem = useCallback<LocalStorage<D>['setItem']>(
		(itemKey, value) => setData({ ...getData(), [itemKey]: value }),
		[getData, setData],
	);

	return useMemo(
		() => ({
			getData,
			setData,
			getItem,
			setItem,
		}),
		[getData, getItem, setData, setItem],
	);
};
