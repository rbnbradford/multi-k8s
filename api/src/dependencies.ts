import { Pool } from 'pg';
import * as redis from 'redis';
import { AsyncRedisClient } from './async-redis-client';
import { asInteger, asString, getEnvOrThrow, getEnvsOrThrow } from './getEnvs';

const env = getEnvsOrThrow({
	pgHost: ['PGHOST', asString],
	pgPort: ['PGPORT', asInteger],
	pgUser: ['PGUSER', asString],
	pgPassword: ['PGPASSWORD', asString],
	pgDatabase: ['PGDATABASE', asString],
	redisHost: ['REDIS_HOST', asString],
	redisPort: ['REDIS_PORT', asInteger],
});

const pgHost = getEnvOrThrow('PGHOST');
const pgPort = getEnvOrThrow('PGPORT', asInteger);
const pgUser = getEnvOrThrow('PGUSER');
const pgPassword = getEnvOrThrow('PGPASSWORD');
const pgDatabase = getEnvOrThrow('PGDATABASE');
const redisHost = getEnvOrThrow('REDIS_HOST');
const redisPort = getEnvOrThrow('REDIS_PORT', asInteger);

export const postgresClient = new Pool({
	host: pgHost,
	port: pgPort,
	user: pgUser,
	password: pgPassword,
	database: pgDatabase,
}).on('connect',
	self => self
		.query('CREATE TABLE IF NOT EXISTS values (number INT)')
		.catch(err => console.log(err)))
	.on('error', () => console.log('Lost Postgres Connection'));

const innerRedisClient = redis.createClient({
	host: redisHost,
	port: redisPort,
	retry_strategy: () => 1000,
});
export const redisSub = innerRedisClient;
export const redisClient = AsyncRedisClient.wrap(innerRedisClient.duplicate());
