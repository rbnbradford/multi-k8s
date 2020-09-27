import * as express from 'express';
import * as cors from 'cors';
import { json } from 'body-parser';
import { postgresClient, redisClient, redisSub, tryParseInt } from './dependencies';
import { server as webSocketServer } from 'websocket';
import * as http from 'http';

const port = 5000;

express()
	.use(cors())
	.use(json())
	.get('/', async (req, res) => res.send('Hi'))
	.get('/values/seen', async (req, res) => {
		const result = await postgresClient.query<{ number: number }>('SELECT number from values')
		res.send(result.rows.map(x => x.number));
	})
	.get('/values/calculated', async (req, res) => {
		const values = await redisClient.hgetall('values') ?? {};
		const transformed = Object.entries(values).map(([k, v]) => ({ index: k, value: v }))
		res.send(transformed);
	})
	.post('/values', async (req, res) => {
		const indexString = req.body.index;
		const index = tryParseInt(indexString);
		if (index === undefined) return res.status(422).send('integer field index not supplied')
		if (index > 40) return res.status(422).send('index too high')
		await redisClient.hset('values', indexString, 'Nothing Yet!')
		await redisClient.publish('calculated', '')
		await redisClient.publish('insert', indexString);
		await postgresClient.query('INSERT INTO values(number) VALUES($1)', [index])
		res.sendStatus(200);
	})
	.listen(port, () => console.log(`listening on ${port}`));

const webSocketsServerPort = 8000;
const server = http.createServer();
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
	httpServer: server
});

redisSub.subscribe('calculated')

wsServer.on('request', function(request) {
	console.log(`${new Date()} Recieved a new connection from origin ${request.origin}.`);
	const connection = request.accept(undefined, request.origin);
	console.log('connected');
	redisSub.on('message', async () => {
		const values = await redisClient.hgetall('values') ?? {};
		const transformed = Object.entries(values).map(([k, v]) => ({ index: k, value: v }))
		connection.sendUTF(JSON.stringify(transformed));
	})
});

