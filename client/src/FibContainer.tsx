import { useEffect, useState } from 'react';
import { Fib } from './Fib';
import { CalculatedValue, FibonacciLiveUpdateService, FibonacciService } from './api/fibonacci';

export const FibContainer = ({fibonacciService, fibonacciLiveUpdateService}: {fibonacciService: FibonacciService, fibonacciLiveUpdateService: FibonacciLiveUpdateService}) => {
	const [calculatedValues, setCalculatedValues] = useState<CalculatedValue[]>([]);
	const [seenIndexes, setSeenIndexes] = useState<number[]>([]);
	const [index, setIndex] = useState<string>('');
	useEffect(() => {
		fibonacciService.getSeenIndexes().then(setSeenIndexes);
		fibonacciService.getCalculatedValues().then(setCalculatedValues);
		fibonacciLiveUpdateService.setHandler(setCalculatedValues)
		return fibonacciLiveUpdateService.close;
	}, [fibonacciService, fibonacciLiveUpdateService])

	const onSubmitIndex = async () => {
		const indexAsInteger = parseInt(index);
		if (!isNaN(indexAsInteger)) await fibonacciService.submitIndex(indexAsInteger)
		setIndex('')
	}

	return Fib({ index, setIndex, onSubmitIndex, seenIndexes, calculatedValues });
}
