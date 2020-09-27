import * as redis from 'redis';
import { fibGood, fibLong } from './fibonacci';

const getEnvOrThrow = <T>(key: string, converter: (value: string) => T | undefined): T => {
	const x = process.env[key];
	if (x === undefined) throw new Error(`env var ${key} not defined`)
	const converted = converter(x);
	if (converted === undefined) throw new Error(`env var ${key} with value ${x} could not be converted`)
	return converted;
}
const tryParseInt = (str: string): number | undefined => {
	const v = parseInt(str);
	return isNaN(v) ? undefined : v;
}

const redisHost = getEnvOrThrow('REDIS_HOST', x => x);
const redisPort = getEnvOrThrow('REDIS_PORT', tryParseInt);

const redisClient = redis.createClient({
	host: redisHost,
	port: redisPort,
	retry_strategy: () => 1000,
});

const redisSub = redisClient.duplicate();

redisSub.on('message', async (channel, message) => {
	console.log(`channel:${channel}; message ${message}`);
	const value = tryParseInt(message);
	if (value === undefined) return  console.log(`invalid message: ${message}`)
	const result = await fibLong(value);
	redisClient.hset('values', message, result.toString());
	redisClient.publish('calculated', '')
})
redisSub.subscribe('insert')










