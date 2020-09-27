import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { CalculatedValue, FibonacciLiveUpdateService } from '../fibonacci';


export const fibonacciLiveUpdateServiceWebSockets = (url: string): FibonacciLiveUpdateService => {
	let client: W3CWebSocket | undefined = undefined;
	return {
		setHandler(handler: (calculatedValues: CalculatedValue[]) => void) {
			if (client === undefined) {
				client = new W3CWebSocket('ws:' + url);
				client.onopen = () => console.log('websocket setHandler');
				client.onerror = error => console.log(JSON.stringify(error.name));
			}
			client.onmessage = ((m) => handler(JSON.parse(m.data as string) as CalculatedValue[]));
		},
		close() {
			client?.close();
			client = undefined;
		},
	}
}