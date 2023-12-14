let data: Record<string, string> = {};

class ModuleStorage implements Storage {
	/**
	 * Empties the list associated with the object of all key/value pairs, if there are any.
	 */
	clear(): void {
		data = {};
	}

	public get length(): number {
		return Object.keys(data).length;
	}

	getItem(key: string): string | null {
		return data[key];
	}

	key(): string | null {
		return null;
	}

	removeItem(key: string): void {
		delete data[key];
	}

	setItem(key: string, value: string): void {
		data[key] = value;
	}
}

export const moduleStorage = new ModuleStorage();
