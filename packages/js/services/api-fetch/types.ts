export interface BaseApiUtilArgs {
	setInProgress?: (state: boolean) => void;
	setResult?: (result: unknown) => void;
	setResultType?: (resultType: ResultType) => void;
}

export type ResultType = 'SUCCESS' | 'ERROR';

// biome-ignore lint/suspicious/noExplicitAny: Any is fine here
export type TestResult<T = any> = {
	// e.g. {[id]: result}
	[key: string]: T;
};

export type TestResultType = {
	// e.g. {[id]: resultType}
	[key: string]: ResultType;
};
