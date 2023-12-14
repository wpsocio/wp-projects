export interface BaseApiUtilArgs {
	setInProgress?: (state: boolean) => void;
	setResult?: (result: any) => void;
	setResultType?: (resultType: ResultType) => void;
}

export type ResultType = 'SUCCESS' | 'ERROR';

export type TestResult<T = any> = {
	// e.g. {[id]: result}
	[key: string]: T;
};

export type TestResultType = {
	// e.g. {[id]: resultType}
	[key: string]: ResultType;
};
