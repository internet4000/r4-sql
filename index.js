const sqlite3 = require('sqlite3')
const db = require('./db.js')

const fastify = require('fastify')({
	logger: true
})

fastify.get('/', async (request, reply) => {
	return {hello: 'world'}
})

fastify.get('/users', (request, reply) => {
	db.all('SELECT id, email, channel_id FROM users', (err, data) => {
		if (err) return {error: err}
		reply.send({data})
	})
})

fastify.get('/users/:id', (request, reply) => {
	const {id} = request.params
	// console.log(request.params)
	// reply.send({id})
	db.get(`SELECT * FROM users WHERE id = "${id}"`, (err, data) => {
		if (err) return {error: err}
		console.log(data)
		reply.send({data})
	})
})

fastify.get('/channels', (request, reply) => {
	db.all('SELECT * FROM channels', (err, data) => {
		if (err) reply.send({error: err})
		reply.send({data})
	})
})

fastify.get('/channels/:id', (request, reply) => {
	const {id} = request.params
	db.get(`SELECT * FROM channels WHERE id = "${id}"`, (err, data) => {
		if (err) return {error: err}
		reply.send({data})
	})
})

const start = async () => {
	try {
		await fastify.listen(3000)
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

// Run the server!
start()
