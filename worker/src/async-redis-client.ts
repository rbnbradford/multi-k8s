import * as redis from 'redis';

export type AsyncRedisClient = {
	get: (k: string) => Promise<string>
	set: (k: string, v: string) => Promise<'OK'>
}

export module AsyncRedisClient {
	export const wrap = (rc: redis.RedisClient): AsyncRedisClient => ({
		get: (k) => new Promise((resolve, reject) => rc.get(k, (err, value) => err ? reject(err) : resolve(value))),
		set: (k: string, v: string): Promise<'OK'> => new Promise((resolve, reject) => rc.set(k, v, (err, reply) => err ? reject(err) : resolve(reply))),
	});
}
