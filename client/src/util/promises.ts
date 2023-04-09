export const promiseToResultErrorPair = <T>(promise: Promise<T>): Promise<{ result?: T; error?: any }> =>
	promise.then((result) => ({ result })).catch((error) => ({ error }));
