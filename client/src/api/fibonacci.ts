export type CalculatedValue = { index: number, value: number };

export type FibonacciService = {
	getSeenIndexes: () => Promise<number[]>;
	getCalculatedValues: () => Promise<CalculatedValue[]>;
	submitIndex: (index: number) => Promise<void>;
};

export type FibonacciLiveUpdateService = {
	setHandler: (handler: (calculatedValues: CalculatedValue[]) => void) => void;
	close: () => void
}
