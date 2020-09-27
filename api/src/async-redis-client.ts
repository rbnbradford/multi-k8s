import * as redis from 'redis';

export type AsyncRedisClient = {
	get: (key: string) => Promise<string>
	set: (key: string, v: string) => Promise<'OK'>
	hgetall: (key: string) => Promise<{ [key: string]: string }>
	hset: (key: string, field: string, value: string) => Promise<number>
	publish: (channel: string, value: string) => Promise<number>
}

export module AsyncRedisClient {
	export const wrap = (redisClient: redis.RedisClient): AsyncRedisClient => ({
		get: (key) => new Promise((resolve, reject) => redisClient.get(key, (err, value) => err ? reject(err) : resolve(value))),
		set: (key, value) => new Promise((resolve, reject) => redisClient.set(key, value, (err, reply) => err ? reject(err) : resolve(reply))),
		hgetall: (key) => new Promise((resolve, reject) => redisClient.hgetall(key, (err, reply) => err ? reject(err) : resolve(reply))),
		hset: (key, field, value) => new Promise((resolve, reject) => redisClient.hset(key, field, value, (err, reply) => err ? reject(err) : resolve(reply))),
		publish: (channel, value) => new Promise((resolve, reject) => redisClient.publish(channel, value, (err, reply) => err ? reject(err) : resolve(reply))),
	});
}
