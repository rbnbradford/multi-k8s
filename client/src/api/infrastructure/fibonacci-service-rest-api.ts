import axios from 'axios';
import { CalculatedValue, FibonacciService } from '../fibonacci';


export const fibonacciServiceRestApi = (url: string): FibonacciService => ({
	getSeenIndexes: (): Promise<number[]> => axios.get<number[]>(`${url}/values/seen`).then(x => x.data).catch(() => []),
	getCalculatedValues: (): Promise<CalculatedValue[]> => axios.get<CalculatedValue[]>(`${url}/values/calculated`).then(x => x.data).catch(() => []),
	submitIndex: (index: number): Promise<void> => axios.post(`${url}/values`, { index }),
})