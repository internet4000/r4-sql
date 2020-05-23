const db = require('./db')

const fastify = require('fastify')({
	// logger: true
})

fastify.get('/', async (request, reply) => {
	return {hello: 'world'}
})

fastify.get('/users', (request, reply) => {
	db.all('SELECT rowid AS id, email FROM users', (err, data) => {
		if (err) return {error: err}
		reply.send({data})
	})
})

fastify.get('/users/:id', (request, reply) => {
	const {id} = request.params
	db.get(
		`SELECT rowid AS id, email FROM users WHERE rowid = ${id}`,
		(err, data) => {
			if (err) return {error: err}
			reply.send({data})
		}
	)
})

fastify.get('/channels', (request, reply) => {
	db.all('SELECT *, rowid AS id FROM channels', (err, data) => {
		if (err) reply.send({error: err})
		reply.send({data})
	})
})

fastify.get('/channels/:id', (request, reply) => {
	const {id} = request.params
	db.get(
		`SELECT rowid AS id, * FROM channels WHERE rowid = ${id}`,
		(err, data) => {
			if (err) return {error: err}
			reply.send({data})
		}
	)
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
